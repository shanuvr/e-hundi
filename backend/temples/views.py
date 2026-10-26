import json
import os
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import transaction
from django.utils.text import slugify
from .models import Temple


def parse_json(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except Exception:
        return {}


# -------------------------------------------------------------
# SUPERADMIN AUTHENTICATION
# -------------------------------------------------------------

@csrf_exempt
def superadmin_login_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    data = parse_json(request)
    username = data.get('username') or data.get('email', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return JsonResponse({'error': 'Username and password are required'}, status=400)

    # Try authenticating directly or lookup by email
    user = authenticate(request, username=username, password=password)
    if not user and '@' in username:
        try:
            match = User.objects.get(email=username)
            user = authenticate(request, username=match.username, password=password)
        except (User.DoesNotExist, User.MultipleObjectsReturned):
            pass

    if not user:
        return JsonResponse({'error': 'Invalid superuser credentials'}, status=401)

    if not user.is_superuser:
        return JsonResponse({'error': 'Access denied: Superuser privileges required'}, status=403)

    login(request, user)
    return JsonResponse({
        'success': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_superuser': user.is_superuser,
        }
    })


@csrf_exempt
def superadmin_me_view(request):
    if not request.user.is_authenticated or not request.user.is_superuser:
        return JsonResponse({'authenticated': False}, status=401)

    return JsonResponse({
        'authenticated': True,
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'is_superuser': True,
        }
    })


@csrf_exempt
def superadmin_logout_view(request):
    logout(request)
    return JsonResponse({'success': True})


# -------------------------------------------------------------
# SUPERADMIN TEMPLE MANAGEMENT
# -------------------------------------------------------------

@csrf_exempt
def temples_list_create_view(request):
    if request.method == 'GET':
        query = request.GET.get('q', '').strip().lower()
        temples = Temple.objects.select_related('user').all().order_by('-created_at')

        if query:
            temples = [
                t for t in temples
                if query in t.name.lower() or query in t.email.lower() or query in t.city.lower()
            ]

        return JsonResponse({
            'count': len(temples),
            'temples': [t.to_dict(include_bank=True) for t in temples]
        })

    elif request.method == 'POST':
        data = parse_json(request)

        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '').strip()

        # Mandatory Bank Details
        bank_name = data.get('bank_name', '').strip()
        bank_account_holder = data.get('bank_account_holder', '').strip()
        bank_account_number = data.get('bank_account_number', '').strip()
        bank_ifsc = data.get('bank_ifsc', '').strip().upper()
        upi_id = data.get('upi_id', '').strip()

        # Validation
        errors = {}
        if not name:
            errors['name'] = 'Temple name is required'
        if not email:
            errors['email'] = 'Login email is required'
        elif User.objects.filter(email=email).exists() or User.objects.filter(username=email).exists():
            errors['email'] = 'A user with this email already exists'
        if not password:
            errors['password'] = 'Login password is required'
        elif len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters'

        # Bank validations (Mandatory)
        if not bank_name:
            errors['bank_name'] = 'Bank name is mandatory'
        if not bank_account_holder:
            errors['bank_account_holder'] = 'Account holder name is mandatory'
        if not bank_account_number:
            errors['bank_account_number'] = 'Account number is mandatory'
        if not bank_ifsc:
            errors['bank_ifsc'] = 'IFSC code is mandatory'

        if len(data.get('slogan_ml', '').strip()) > 121:
            errors['slogan_ml'] = 'Main Hundi Blessing (Malayalam) cannot exceed 121 characters'

        if errors:
            return JsonResponse({'errors': errors, 'message': 'Please fill all mandatory fields'}, status=400)

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password,
                )

                temple = Temple.objects.create(
                    user=user,
                    name=name,
                    name_ml=data.get('name_ml', '').strip(),
                    short_name=data.get('short_name', '').strip(),
                    slug=data.get('slug', '').strip() or None,
                    primary_language=data.get('primary_language', 'ml'),
                    logo_url=data.get('logo_url', '').strip(),
                    phone=data.get('phone', '').strip(),
                    whatsapp=data.get('whatsapp', '').strip(),
                    email=email,
                    street_address=data.get('street_address', '').strip(),
                    city=data.get('city', '').strip(),
                    state=data.get('state', 'Kerala').strip(),
                    pin_code=data.get('pin_code', '').strip(),
                    gstin=data.get('gstin', '').strip(),
                    slogan_ml=data.get('slogan_ml', '').strip(),
                    slogan_en=data.get('slogan_en', '').strip(),
                    darshan_video_url=data.get('darshan_video_url', '').strip(),
                    darshan_thumbnail_url=data.get('darshan_thumbnail_url', '').strip(),
                    darshan_message_template=data.get('darshan_message_template', '').strip(),
                    bank_name=bank_name,
                    bank_account_holder=bank_account_holder,
                    bank_account_number=bank_account_number,
                    bank_ifsc=bank_ifsc,
                    upi_id=upi_id,
                )

            return JsonResponse({
                'success': True,
                'message': 'Temple registered successfully',
                'temple': temple.to_dict(include_bank=True),
            }, status=201)

        except Exception as e:
            return JsonResponse({'error': f'Failed to create temple: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def temple_detail_update_delete_view(request, pk):
    try:
        temple = Temple.objects.select_related('user').get(pk=pk)
    except Temple.DoesNotExist:
        return JsonResponse({'error': 'Temple not found'}, status=404)

    if request.method == 'GET':
        return JsonResponse({'temple': temple.to_dict(include_bank=True)})

    elif request.method == 'PUT':
        data = parse_json(request)

        # Basic identity
        if 'name' in data and data['name'].strip():
            temple.name = data['name'].strip()
        if 'name_ml' in data:
            temple.name_ml = data['name_ml'].strip()
        if 'short_name' in data:
            temple.short_name = data['short_name'].strip()
        if 'slug' in data and data['slug'].strip():
            temple.slug = data['slug'].strip()
        if 'primary_language' in data:
            temple.primary_language = data['primary_language']

        # Assets & Contact
        if 'logo_url' in data:
            temple.logo_url = data['logo_url'].strip()
        if 'phone' in data:
            temple.phone = data['phone'].strip()
        if 'whatsapp' in data:
            temple.whatsapp = data['whatsapp'].strip()

        # Email update
        new_email = data.get('email', '').strip().lower()
        if new_email and new_email != temple.email:
            if User.objects.filter(email=new_email).exclude(pk=temple.user.pk).exists():
                return JsonResponse({'error': 'This email is already in use by another account'}, status=400)
            temple.email = new_email
            temple.user.email = new_email
            temple.user.username = new_email
            temple.user.save()

        # Optional password update
        new_password = data.get('password', '').strip()
        if new_password:
            if len(new_password) < 6:
                return JsonResponse({'error': 'Password must be at least 6 characters'}, status=400)
            temple.user.set_password(new_password)
            temple.user.save()

        # Location
        if 'street_address' in data:
            temple.street_address = data['street_address'].strip()
        if 'city' in data:
            temple.city = data['city'].strip()
        if 'state' in data:
            temple.state = data['state'].strip()
        if 'pin_code' in data:
            temple.pin_code = data['pin_code'].strip()
        if 'gstin' in data:
            temple.gstin = data['gstin'].strip()

        # Slogans & Darshan
        if 'slogan_ml' in data:
            val = data['slogan_ml'].strip()
            if len(val) > 121:
                return JsonResponse({'message': 'Main Hundi Blessing (Malayalam) cannot exceed 121 characters'}, status=400)
            temple.slogan_ml = val
        if 'slogan_en' in data:
            temple.slogan_en = data['slogan_en'].strip()
        if 'darshan_video_url' in data:
            temple.darshan_video_url = data['darshan_video_url'].strip()
        if 'darshan_thumbnail_url' in data:
            temple.darshan_thumbnail_url = data['darshan_thumbnail_url'].strip()
        if 'darshan_message_template' in data:
            temple.darshan_message_template = data['darshan_message_template'].strip()

        # Bank details (Superadmin-only updates)
        if 'bank_name' in data and data['bank_name'].strip():
            temple.bank_name = data['bank_name'].strip()
        if 'bank_account_holder' in data and data['bank_account_holder'].strip():
            temple.bank_account_holder = data['bank_account_holder'].strip()
        if 'bank_account_number' in data and data['bank_account_number'].strip():
            temple.bank_account_number = data['bank_account_number'].strip()
        if 'bank_ifsc' in data and data['bank_ifsc'].strip():
            temple.bank_ifsc = data['bank_ifsc'].strip().upper()
        if 'upi_id' in data and data['upi_id'].strip():
            temple.upi_id = data['upi_id'].strip()

        temple.save()
        return JsonResponse({
            'success': True,
            'message': 'Temple updated successfully',
            'temple': temple.to_dict(include_bank=True),
        })

    elif request.method == 'DELETE':
        user = temple.user
        temple.delete()
        if user:
            user.delete()
        return JsonResponse({'success': True, 'message': 'Temple and credentials deleted'})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def temple_toggle_status_view(request, pk):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    try:
        temple = Temple.objects.select_related('user').get(pk=pk)
        temple.is_active = not temple.is_active
        temple.save()
        if temple.user:
            temple.user.is_active = temple.is_active
            temple.user.save()
        return JsonResponse({
            'success': True,
            'is_active': temple.is_active,
            'message': f"Temple {'activated' if temple.is_active else 'deactivated'} successfully"
        })
    except Temple.DoesNotExist:
        return JsonResponse({'error': 'Temple not found'}, status=404)


# -------------------------------------------------------------
# TEMPLE ADMIN AUTH & PROFILE (/admin)
# -------------------------------------------------------------

@csrf_exempt
def admin_login_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    data = parse_json(request)
    identifier = data.get('email') or data.get('username', '').strip()
    password = data.get('password', '')

    if not identifier or not password:
        return JsonResponse({'error': 'Email and password are required'}, status=400)

    user = authenticate(request, username=identifier, password=password)
    if not user and '@' in identifier:
        try:
            match = User.objects.get(email=identifier)
            user = authenticate(request, username=match.username, password=password)
        except (User.DoesNotExist, User.MultipleObjectsReturned):
            pass

    if not user:
        return JsonResponse({'error': 'Invalid email or password'}, status=401)

    if not hasattr(user, 'temple'):
        # If user is a superuser logging into /admin, allow them or provide access
        if user.is_superuser:
            first_temple = Temple.objects.first()
            return JsonResponse({
                'success': True,
                'is_superuser': True,
                'temple': first_temple.to_dict(include_bank=False) if first_temple else None,
                'message': 'Superadmin authenticated for console',
            })
        return JsonResponse({'error': 'No temple associated with this account'}, status=403)

    if not user.temple.is_active:
        return JsonResponse({'error': 'This temple account is currently deactivated. Contact Superadmin.'}, status=403)

    login(request, user)
    return JsonResponse({
        'success': True,
        'temple': user.temple.to_dict(include_bank=False),
        'message': 'Signed in successfully',
    })


@csrf_exempt
def admin_logout_view(request):
    logout(request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully'})


@csrf_exempt
def admin_temple_profile_view(request):
    """
    Temple Admins can read & update their profile.
    EXCLUDES changing bank details (Superadmin-only).
    """
    user = request.user
    temple = None

    # Priority 1: Check X-Temple-ID header (from client localStorage) or GET param
    temple_id = request.headers.get('X-Temple-ID') or request.META.get('HTTP_X_TEMPLE_ID') or request.GET.get('temple_id')
    if temple_id:
        try:
            temple = Temple.objects.get(pk=temple_id)
        except (Temple.DoesNotExist, ValueError):
            pass

    # Priority 2: Session user if associated with a temple
    if not temple and user.is_authenticated and hasattr(user, 'temple'):
        temple = user.temple

    if not temple:
        # Default fallback to first active temple for preview/demo
        temple = Temple.objects.filter(is_active=True).first()
        if not temple:
            return JsonResponse({'error': 'No active temple found'}, status=404)

    if request.method == 'GET':
        return JsonResponse({'temple': temple.to_dict(include_bank=False)})

    elif request.method == 'PUT':
        data = parse_json(request)

        # Allow updating profile fields
        if 'name' in data and data['name'].strip():
            temple.name = data['name'].strip()
        if 'name_ml' in data:
            temple.name_ml = data['name_ml'].strip()
        if 'short_name' in data:
            temple.short_name = data['short_name'].strip()
        if 'slug' in data and data['slug'].strip():
            temple.slug = data['slug'].strip()
        if 'primary_language' in data:
            temple.primary_language = data['primary_language']
        if 'logo_url' in data:
            temple.logo_url = data['logo_url'].strip()
        if 'phone' in data:
            temple.phone = data['phone'].strip()
        if 'whatsapp' in data:
            temple.whatsapp = data['whatsapp'].strip()
        if 'email' in data and data['email'].strip():
            temple.email = data['email'].strip()
            if temple.user:
                temple.user.email = temple.email
                temple.user.save()
        if 'street_address' in data:
            temple.street_address = data['street_address'].strip()
        if 'city' in data:
            temple.city = data['city'].strip()
        if 'state' in data:
            temple.state = data['state'].strip()
        if 'pin_code' in data:
            temple.pin_code = data['pin_code'].strip()
        if 'gstin' in data:
            temple.gstin = data['gstin'].strip()
        if 'slogan_ml' in data:
            val = data['slogan_ml'].strip()
            if len(val) > 121:
                return JsonResponse({'message': 'Main Hundi Blessing (Malayalam) cannot exceed 121 characters'}, status=400)
            temple.slogan_ml = val
        if 'slogan_en' in data:
            temple.slogan_en = data['slogan_en'].strip()
        if 'darshan_video_url' in data:
            temple.darshan_video_url = data['darshan_video_url'].strip()
        if 'darshan_message_template' in data:
            temple.darshan_message_template = data['darshan_message_template'].strip()

        # NOTE: Bank details are strictly IGNORED here per requirement:
        # "bank details of the temple (mandatory also exclusive to suuperadmin page admins cant change this)"

        temple.save()
        return JsonResponse({
            'success': True,
            'message': 'Temple profile updated successfully',
            'temple': temple.to_dict(include_bank=False),
        })

    return JsonResponse({'error': 'Method not allowed'}, status=405)


# -------------------------------------------------------------
# PUBLIC TEMPLE PORTAL / KIOSK
# -------------------------------------------------------------

@csrf_exempt
def public_default_temple_view(request):
    """
    Returns the first active temple as default for root / preview.
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    temple = Temple.objects.filter(is_active=True).first()
    if not temple:
        return JsonResponse({'error': 'No active temple found'}, status=404)

    return JsonResponse({'success': True, 'temple': temple.to_dict(include_bank=False)})


@csrf_exempt
def public_temple_detail_view(request, identifier):
    """
    Public lookup for a temple by slug, short_name, name, or ID.
    Used by /:templename routes.
    """
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    ident = identifier.strip()
    temple = None

    # 1. Direct slug match
    temple = Temple.objects.filter(slug__iexact=ident).first()

    # 2. Short name match
    if not temple:
        temple = Temple.objects.filter(short_name__iexact=ident).first()

    # 3. Match against slugified short_name or slugified name
    if not temple:
        target_slug = slugify(ident)
        if target_slug:
            temple = Temple.objects.filter(slug__iexact=target_slug).first()

    # 4. Name match
    if not temple:
        temple = Temple.objects.filter(name__iexact=ident).first()

    # 5. ID match if numeric
    if not temple and ident.isdigit():
        temple = Temple.objects.filter(pk=int(ident)).first()

    if not temple:
        return JsonResponse({'error': 'Temple not found', 'identifier': identifier}, status=404)

    if not temple.is_active:
        return JsonResponse({
            'error': 'This temple is currently inactive or undergoing maintenance',
            'is_inactive': True,
            'temple_name': temple.name,
            'temple_name_ml': temple.name_ml,
        }, status=403)

    return JsonResponse({'success': True, 'temple': temple.to_dict(include_bank=False)})


# -------------------------------------------------------------
# DARSHAN VIDEO UPLOAD (15 MB LIMIT)
# -------------------------------------------------------------

MAX_VIDEO_SIZE = 15 * 1024 * 1024  # 15 MB in bytes
ALLOWED_VIDEO_EXTENSIONS = ('.mp4', '.webm', '.mov', '.mkv', '.ogg')


@csrf_exempt
def upload_darshan_video_view(request):
    """
    Upload a sacred darshan video with a strict 15 MB limit.
    Either upload video or enter stream link is supported.
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    video_file = request.FILES.get('video') or request.FILES.get('file')
    if not video_file:
        return JsonResponse({'error': 'No video file provided.'}, status=400)

    # Enforce 15 MB limit
    if video_file.size > MAX_VIDEO_SIZE:
        size_mb = round(video_file.size / (1024 * 1024), 2)
        return JsonResponse({
            'error': f'Video file size ({size_mb} MB) exceeds the 15 MB limit. Please select a video under 15 MB.'
        }, status=400)

    # Extension check
    ext = os.path.splitext(video_file.name)[1].lower()
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        return JsonResponse({
            'error': f'Unsupported video format "{ext}". Supported formats are MP4, WebM, MOV, and OGG.'
        }, status=400)

    try:
        temple_id = (
            request.headers.get('X-Temple-ID')
            or request.POST.get('temple_id')
            or 'temple'
        )
        safe_name = f"darshan_{temple_id}_{uuid.uuid4().hex[:8]}{ext}"
        relative_path = os.path.join('darshan_videos', safe_name)
        saved_path = default_storage.save(relative_path, video_file)

        media_url = f"{settings.MEDIA_URL.rstrip('/')}/{saved_path.replace(os.sep, '/')}"

        return JsonResponse({
            'success': True,
            'video_url': media_url,
            'filename': video_file.name,
            'size': video_file.size,
            'message': 'Darshan video uploaded successfully'
        })
    except Exception as e:
        return JsonResponse({'error': f'Failed to save video: {str(e)}'}, status=500)

