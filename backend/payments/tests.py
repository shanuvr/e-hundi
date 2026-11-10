import json
from unittest.mock import patch, MagicMock
from django.test import TestCase, Client, override_settings
from django.urls import reverse
from django.contrib.auth.models import User
from temples.models import Temple
from payments.models import Payment


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
    def test_cashfree_split_order_creation_and_persistence(self, mock_split):
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

        # Verify Payment model record created
        payment = Payment.objects.filter(order_id='cf_order_test_123').first()
        self.assertIsNotNone(payment)
        self.assertEqual(payment.temple, self.temple)
        self.assertEqual(float(payment.amount), 51.0)
        self.assertEqual(payment.status, 'PENDING')

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
        self.user = User.objects.create_user(username='temple@test.com', email='temple@test.com', password='password123')
        self.temple = Temple.objects.create(
            user=self.user,
            name='Test Temple',
            email='temple@test.com',
            bank_name='HDFC Bank',
            bank_account_holder='Test Temple Trust',
            bank_account_number='123456789012',
            bank_ifsc='HDFC0000001',
        )
        self.payment = Payment.objects.create(
            temple=self.temple,
            order_id='cf_order_test_123',
            amount=100.0,
            status='PENDING',
        )

    def test_missing_order_id_returns_400(self):
        response = self.client.post(
            self.url,
            data=json.dumps({}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    @patch('payments.views.verify_order_status')
    def test_verify_payment_paid_updates_db(self, mock_verify):
        mock_verify.return_value = {
            'order_id': 'cf_order_test_123',
            'order_status': 'PAID',
            'order_amount': 100.0,
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

        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, 'SUCCESS')

    @patch('payments.views.verify_order_status')
    def test_verify_payment_not_paid(self, mock_verify):
        mock_verify.return_value = {
            'order_id': 'cf_order_test_123',
            'order_status': 'ACTIVE',
            'order_amount': 100.0,
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

        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, 'PENDING')


class AdminDashboardViewTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('admin_dashboard')
        self.user = User.objects.create_user(username='temple@test.com', email='temple@test.com', password='password123')
        self.temple = Temple.objects.create(
            user=self.user,
            name='Chinmaya Navagraha',
            email='temple@test.com',
            bank_name='ICICI Bank',
            bank_account_holder='Chinmaya Trust',
            bank_account_number='987654321',
            bank_ifsc='ICIC0000001',
        )
        Payment.objects.create(
            temple=self.temple,
            order_id='ord_101',
            amount=500.0,
            status='SUCCESS',
            donor_name='Ramesh',
            donor_phone='9812345678'
        )
        Payment.objects.create(
            temple=self.temple,
            order_id='ord_102',
            amount=200.0,
            status='SUCCESS',
            donor_name='Priya',
            donor_phone='9812345679'
        )
        Payment.objects.create(
            temple=self.temple,
            order_id='ord_103',
            amount=100.0,
            status='PENDING',
            donor_name='Devotee'
        )

    def test_dashboard_returns_real_metrics_and_offerings(self):
        response = self.client.get(
            self.url,
            HTTP_X_TEMPLE_ID=str(self.temple.id)
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])

        metrics = data['metrics']
        self.assertEqual(metrics['total_amount'], 700.0)
        self.assertEqual(metrics['total_count'], 2)
        self.assertEqual(metrics['unique_donors'], 2)

        offerings = data['offerings']
        self.assertEqual(len(offerings), 3)

        status_counts = data['status_counts']
        self.assertEqual(status_counts['All'], 3)
        self.assertEqual(status_counts['Success'], 2)
        self.assertEqual(status_counts['Pending'], 1)

    def test_dashboard_filter_by_status(self):
        response = self.client.get(
            f"{self.url}?status=Pending",
            HTTP_X_TEMPLE_ID=str(self.temple.id)
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        offerings = data['offerings']
        self.assertEqual(len(offerings), 1)
        self.assertEqual(offerings[0]['order_id'], 'ord_103')
