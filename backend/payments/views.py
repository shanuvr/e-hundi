import json
import uuid
import razorpay
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


@csrf_exempt
@require_http_methods(["POST"])
def create_order(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        amount = float(data.get('amount', 0))
        if amount <= 0:
            return JsonResponse({'error': 'Invalid amount'}, status=400)

        amount_in_paise = int(round(amount * 100))
        key_id = settings.RAZORPAY_KEY_ID
        key_secret = settings.RAZORPAY_KEY_SECRET

        order_id = None
        # Attempt to create actual Razorpay Order if keys are provided
        if key_id and key_secret and not key_id.startswith('rzp_test_placeholder'):
            try:
                client = razorpay.Client(auth=(key_id, key_secret))
                order_data = {
                    'amount': amount_in_paise,
                    'currency': 'INR',
                    'receipt': f'hundi_{uuid.uuid4().hex[:10]}',
                    'notes': {
                        'merchant': settings.RAZORPAY_MERCHANT_NAME,
                        'upi_id': settings.RAZORPAY_UPI_ID,
                    }
                }
                order = client.order.create(data=order_data)
                order_id = order.get('id')
            except Exception as e:
                # If Razorpay API call fails (e.g. invalid test keys or network), return informative response
                return JsonResponse({'error': f'Razorpay API error: {str(e)}'}, status=502)

        return JsonResponse({
            'order_id': order_id,
            'amount': amount_in_paise,
            'currency': 'INR',
            'key_id': key_id,
            'merchant_name': settings.RAZORPAY_MERCHANT_NAME,
            'upi_id': settings.RAZORPAY_UPI_ID,
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
