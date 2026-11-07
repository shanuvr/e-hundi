import json
import re
import uuid
import urllib.request
import urllib.error
from django.conf import settings


def get_cashfree_base_url():
    env = getattr(settings, 'CASHFREE_ENV', 'SANDBOX').upper()
    return 'https://sandbox.cashfree.com/pg' if env == 'SANDBOX' else 'https://api.cashfree.com/pg'


def get_headers():
    return {
        'Content-Type': 'application/json',
        'x-api-version': getattr(settings, 'CASHFREE_API_VERSION', '2023-08-01'),
        'x-client-id': getattr(settings, 'CASHFREE_APP_ID', ''),
        'x-client-secret': getattr(settings, 'CASHFREE_SECRET_KEY', ''),
    }


def _make_request(endpoint, method='GET', payload=None):
    base_url = get_cashfree_base_url()
    url = f"{base_url}{endpoint}"
    headers = get_headers()
    data_bytes = json.dumps(payload).encode('utf-8') if payload is not None else None

    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode('utf-8')
            return resp.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        try:
            err_json = json.loads(err_body)
        except Exception:
            err_json = {'raw': err_body}
        return e.code, err_json
    except Exception as e:
        return 500, {'error': str(e)}


def clean_phone(phone_str):
    digits = re.sub(r'\D', '', str(phone_str or ''))
    if len(digits) >= 10 and digits[-10] in '6789':
        return digits[-10:]
    return '9876543210'


def resolve_pan(temple):
    # Use explicitly entered PAN if present
    if temple.pan_number and len(temple.pan_number.strip()) == 10:
        return temple.pan_number.strip().upper()

    # Extract PAN from GSTIN if 15 chars (chars 3 to 12)
    gstin = (temple.gstin or '').strip().upper()
    if len(gstin) == 15:
        return gstin[2:12]

    # In sandbox fallback to valid dummy PAN format (5 letters, 4 digits, 1 letter)
    return 'AAATT1234F'


def sync_temple_as_vendor(temple):
    """
    Registers or confirms the temple as a Cashfree Easy Split vendor
    using bank details configured in Superadmin.
    """
    if not temple.bank_account_number or not temple.bank_ifsc:
        raise ValueError(f"Temple {temple.name} is missing mandatory bank account details")

    vendor_id = temple.cashfree_vendor_id or f"temple_{temple.id}"

    # Check if vendor already exists on Cashfree
    status_code, existing = _make_request(f"/easy-split/vendors/{vendor_id}", method='GET')
    if status_code == 200:
        temple.cashfree_vendor_id = vendor_id
        temple.cashfree_status = existing.get('status', 'ACTIVE')
        temple.save(update_fields=['cashfree_vendor_id', 'cashfree_status'])
        return existing

    # Prepare vendor registration payload
    vendor_payload = {
        'vendor_id': vendor_id,
        'status': 'ACTIVE',
        'name': (temple.bank_account_holder or temple.name)[:100],
        'email': temple.email or f'temple_{temple.id}@ehundi.org',
        'phone': clean_phone(temple.phone),
        'verify_account': False,
        'schedule_option': 1,
        'bank': {
            'account_number': str(temple.bank_account_number).strip(),
            'account_holder': (temple.bank_account_holder or temple.name)[:100],
            'ifsc': temple.bank_ifsc.strip().upper(),
        },
        'kyc_details': {
            'account_type': 'BUSINESS',
            'business_type': 'Society/Trust/Club/Association',
            'pan': resolve_pan(temple),
        }
    }

    if temple.gstin and len(temple.gstin.strip()) == 15:
        vendor_payload['kyc_details']['gst'] = temple.gstin.strip().upper()

    code, resp = _make_request('/easy-split/vendors', method='POST', payload=vendor_payload)
    if code in (200, 201):
        temple.cashfree_vendor_id = vendor_id
        temple.cashfree_status = resp.get('status', 'ACTIVE')
        temple.save(update_fields=['cashfree_vendor_id', 'cashfree_status'])
        return resp
    else:
        # If already exists with different message or error
        err_msg = resp.get('message', str(resp))
        raise RuntimeError(f"Cashfree vendor registration failed: {err_msg}")


def create_split_order(amount, temple, customer_name='Devotee', customer_phone=None, customer_email=None, return_url=None):
    """
    Creates a Cashfree order splitting 100% directly to the temple's vendor bank account.
    """
    app_id = getattr(settings, 'CASHFREE_APP_ID', None)
    secret_key = getattr(settings, 'CASHFREE_SECRET_KEY', None)
    if not app_id or not secret_key:
        raise ValueError("Cashfree credentials are not configured in settings")

    # Ensure vendor is synced
    if not temple.cashfree_vendor_id:
        sync_temple_as_vendor(temple)

    phone = clean_phone(customer_phone or temple.phone)
    order_id = f"order_{temple.id}_{uuid.uuid4().hex[:12]}"

    order_payload = {
        'order_id': order_id,
        'order_amount': round(float(amount), 2),
        'order_currency': 'INR',
        'customer_details': {
            'customer_id': f"donor_{uuid.uuid4().hex[:8]}",
            'customer_name': customer_name or 'Devotee',
            'customer_phone': phone,
            'customer_email': customer_email or temple.email or 'donor@ehundi.org',
        },
        'order_splits': [
            {
                'vendor_id': temple.cashfree_vendor_id,
                'percentage': 100,
            }
        ],
        'order_note': f"Devotional offering to {temple.name}",
    }

    if return_url:
        order_payload['order_meta'] = {'return_url': return_url}

    code, resp = _make_request('/orders', method='POST', payload=order_payload)
    if code in (200, 201):
        return {
            'order_id': resp.get('order_id', order_id),
            'cf_order_id': resp.get('cf_order_id'),
            'payment_session_id': resp.get('payment_session_id'),
            'order_status': resp.get('order_status', 'ACTIVE'),
            'amount': resp.get('order_amount', amount),
            'currency': resp.get('order_currency', 'INR'),
            'environment': getattr(settings, 'CASHFREE_ENV', 'SANDBOX').lower(),
        }
    else:
        err_msg = resp.get('message', str(resp))
        raise RuntimeError(f"Cashfree order creation failed ({code}): {err_msg}")


def verify_order_status(order_id):
    """
    Queries Cashfree for order status.
    """
    code, resp = _make_request(f"/orders/{order_id}", method='GET')
    if code == 200:
        return {
            'order_id': resp.get('order_id'),
            'order_status': resp.get('order_status'),
            'order_amount': resp.get('order_amount'),
            'order_splits': resp.get('order_splits'),
        }
    err_msg = resp.get('message', str(resp))
    raise RuntimeError(f"Failed to fetch order status ({code}): {err_msg}")