import json
from unittest.mock import patch, MagicMock
from django.test import TestCase, Client
from django.urls import reverse


class CreateOrderTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('create_order')

    def test_invalid_amount_returns_400(self):
        response = self.client.post(
            self.url,
            data=json.dumps({'amount': 0}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

    @patch('razorpay.Client')
    def test_valid_amount_returns_order_payload(self, mock_client_cls):
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
        self.assertEqual(data['amount'], 5100)
        self.assertEqual(data['currency'], 'INR')
        self.assertEqual(data['merchant_name'], 'programers')
        self.assertEqual(data['upi_id'], 'programers@icici')

