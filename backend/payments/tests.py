import json
from unittest.mock import patch, MagicMock
from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.contrib.auth.models import User
from temples.models import Temple


class CreateOrderTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('create_order')
        self.user = User.objects.create_user(username='temple@test.com', email='temple@test.com', password='password123')
        self.temple = Temple.objects.create(
            user=self.user,
            name='Test Temple',
            email='temple@test.com',
            bank_name='HDFC Bank',
            bank_account_holder='Test Temple Trust',
            bank_account_number='123456789012',
            bank_ifsc='HDFC0000001',
            pan_number='AAATT1234F',
            upi_id='temple@hdfc'
        )

    def test_invalid_amount_returns_400(self):
        response = self.client.post(
            self.url,
            data=json.dumps({'amount': 0}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    @override_settings(
        CASHFREE_APP_ID='TEST_APP',
        CASHFREE_SECRET_KEY='TEST_SECRET',
        CASHFREE_ENV='SANDBOX'
    )
    @patch('payments.views.create_split_order')
    def test_cashfree_split_order_creation(self, mock_split):
        mock_split.return_value = {
            'order_id': 'cf_order_test_123',
            'cf_order_id': '1472521',
            'payment_session_id': 'session_mock_123',
            'order_status': 'ACTIVE',
            'amount': 51.0,
            'currency': 'INR',
            'environment': 'sandbox',
        }

        response = self.client.post(
            self.url,
            data=json.dumps({'amount': 51, 'temple_id': self.temple.id}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['gateway'], 'cashfree')
        self.assertEqual(data['order_id'], 'cf_order_test_123')
        self.assertEqual(data['payment_session_id'], 'session_mock_123')
        self.assertEqual(data['temple_name'], 'Test Temple')
        self.assertEqual(data['upi_id'], 'temple@hdfc')

    @override_settings(
        CASHFREE_APP_ID=None,
        CASHFREE_SECRET_KEY=None,
        RAZORPAY_KEY_ID='rzp_live_test',
        RAZORPAY_KEY_SECRET='rzp_secret_test',
        RAZORPAY_MERCHANT_NAME='programers',
        RAZORPAY_UPI_ID='programers@icici'
    )
    @patch('razorpay.Client')
    def test_razorpay_fallback(self, mock_client_cls):
        mock_client = MagicMock()
        mock_client.order.create.return_value = {'id': 'order_mock_12345'}
        mock_client_cls.return_value = mock_client

        response = self.client.post(
            self.url,
            data=json.dumps({'amount': 51}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['gateway'], 'razorpay')
        self.assertEqual(data['order_id'], 'order_mock_12345')
        self.assertEqual(data['amount'], 5100)


class VerifyPaymentTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('verify_payment')

    def test_missing_order_id_returns_400(self):
        response = self.client.post(
            self.url,
            data=json.dumps({}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    @patch('payments.views.verify_order_status')
    def test_verify_payment_paid(self, mock_verify):
        mock_verify.return_value = {
            'order_id': 'cf_order_test_123',
            'order_status': 'PAID',
            'order_amount': 51.0,
        }
        response = self.client.post(
            self.url,
            data=json.dumps({'order_id': 'cf_order_test_123'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['order_status'], 'PAID')

    @patch('payments.views.verify_order_status')
    def test_verify_payment_not_paid(self, mock_verify):
        mock_verify.return_value = {
            'order_id': 'cf_order_test_123',
            'order_status': 'ACTIVE',
            'order_amount': 51.0,
        }
        response = self.client.post(
            self.url,
            data=json.dumps({'order_id': 'cf_order_test_123'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['order_status'], 'ACTIVE')

