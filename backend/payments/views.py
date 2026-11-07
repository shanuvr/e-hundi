import json
import uuid
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from temples.models import Temple
from .cashfree import create_split_order, verify_order_status


@csrf_exempt
@require_http_methods(["POST"])
def create_order(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        amount = float(data.get('amount', 0))
        if amount <= 0:
            return JsonResponse({'error': 'Invalid amount'}, status=400)

        temple_id = data.get('temple_id')
        temple = None
        temple_name = ''

        if temple_id:
            try:
                temple = Temple.objects.filter(pk=temple_id).first()
                if temple:
                    temple_name = temple.name
            except Exception:
                pass

        # 1. CASHFREE EASY SPLIT (Primary Gateway)
        cf_app_id = getattr(settings, 'CASHFREE_APP_ID', None)
        cf_secret = getattr(settings, 'CASHFREE_SECRET_KEY', None)

        if cf_app_id and cf_secret and temple:
            try:
                customer_name = data.get('donor_name') or 'Devotee'
                customer_phone = data.get('donor_phone') or temple.phone
                customer_email = data.get('donor_email') or temple.email
                return_url = data.get('return_url')

                cf_order = create_split_order(
                    amount=amount,
                    temple=temple,
                    customer_name=customer_name,
                    customer_phone=customer_phone,
                    customer_email=customer_email,
                    return_url=return_url
                )

                return JsonResponse({
                    'gateway': 'cashfree',
                    'order_id': cf_order['order_id'],
                    'cf_order_id': cf_order['cf_order_id'],
                    'payment_session_id': cf_order['payment_session_id'],
                    'amount': amount,
                    'currency': 'INR',
                    'environment': cf_order['environment'],
                    'temple_name': temple_name,
                    'temple_id': str(temple.id),
                    'upi_id': temple.upi_id,
                })
            except Exception as e:
                return JsonResponse({'error': f'Cashfree Split Gateway error: {str(e)}'}, status=502)

        # 2. RAZORPAY FALLBACK (If Cashfree is not configured)
        key_id = getattr(settings, 'RAZORPAY_KEY_ID', None)
        key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', None)
        amount_in_paise = int(round(amount * 100))
        order_id = None

        if key_id and key_secret and not key_id.startswith('rzp_test_placeholder'):
            try:
                import razorpay
                client = razorpay.Client(auth=(key_id, key_secret))
                order_data = {
                    'amount': amount_in_paise,
                    'currency': 'INR',
                    'receipt': f'hundi_{uuid.uuid4().hex[:10]}',
                    'notes': {
                        'merchant': getattr(settings, 'RAZORPAY_MERCHANT_NAME', ''),
                        'upi_id': getattr(settings, 'RAZORPAY_UPI_ID', ''),
                        'temple_id': str(temple_id or ''),
                        'temple_name': temple_name,
                    }
                }
                order = client.order.create(data=order_data)
                order_id = order.get('id')
            except Exception as e:
                return JsonResponse({'error': f'Razorpay API error: {str(e)}'}, status=502)

        return JsonResponse({
            'gateway': 'razorpay',
            'order_id': order_id,
            'amount': amount_in_paise,
            'currency': 'INR',
            'key_id': key_id,
            'merchant_name': getattr(settings, 'RAZORPAY_MERCHANT_NAME', ''),
            'upi_id': getattr(settings, 'RAZORPAY_UPI_ID', ''),
            'temple_name': temple_name,
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def verify_payment(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        order_id = data.get('order_id')
        if not order_id:
            return JsonResponse({'error': 'order_id is required'}, status=400)

        status_info = verify_order_status(order_id)
        return JsonResponse({
            'success': True,
            'order_status': status_info.get('order_status'),
            'data': status_info
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
