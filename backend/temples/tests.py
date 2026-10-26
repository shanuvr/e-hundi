import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Temple


class SuperadminAndTempleTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.superuser = User.objects.create_superuser(
            username='superadmin',
            email='superadmin@test.com',
            password='Password123!',
        )
        self.regular_user = User.objects.create_user(
            username='regular',
            email='regular@test.com',
            password='Password123!',
        )
        self.temple = Temple.objects.create(
            user=self.regular_user,
            name='Test Temple',
            name_ml='ടെസ്റ്റ് ക്ഷേത്രം',
            short_name='Test',
            email='regular@test.com',
            bank_name='Test Bank',
            bank_account_holder='TEST TRUST',
            bank_account_number='1234567890',
            bank_ifsc='TEST0001234',
        )

    def test_superadmin_login_success(self):
        res = self.client.post(
            '/api/superadmin/login/',
            data=json.dumps({'username': 'superadmin', 'password': 'Password123!'}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertTrue(data['user']['is_superuser'])

    def test_superadmin_login_forbidden_for_regular_user(self):
        res = self.client.post(
            '/api/superadmin/login/',
            data=json.dumps({'username': 'regular@test.com', 'password': 'Password123!'}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 403)

    def test_temple_admin_login(self):
        res = self.client.post(
            '/api/admin/login/',
            data=json.dumps({'email': 'regular@test.com', 'password': 'Password123!'}),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['temple']['name'], 'Test Temple')
        # Bank details should be omitted from temple admin view
        self.assertNotIn('bank_account_number', data['temple'])

    def test_create_temple_missing_bank_fails(self):
        res = self.client.post(
            '/api/superadmin/temples/',
            data=json.dumps({
                'name': 'New Temple',
                'email': 'new@temple.com',
                'password': 'password123',
                # Missing bank details
            }),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 400)
        data = res.json()
        self.assertIn('bank_name', data['errors'])
        self.assertIn('bank_account_holder', data['errors'])
        self.assertIn('bank_account_number', data['errors'])
        self.assertIn('bank_ifsc', data['errors'])

    def test_create_temple_full_success(self):
        res = self.client.post(
            '/api/superadmin/temples/',
            data=json.dumps({
                'name': 'Sabarimala Sannidhanam',
                'name_ml': 'ശബരിമല സന്നിധാനം',
                'short_name': 'Sabarimala',
                'email': 'contact@sabarimala.org',
                'password': 'templepassword123',
                'bank_name': 'State Bank of India',
                'bank_account_holder': 'TRAVANCORE DEVASWOM BOARD',
                'bank_account_number': '570012345678',
                'bank_ifsc': 'SBIN0070001',
                'city': 'Pathanamthitta',
                'state': 'Kerala',
            }),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['temple']['name'], 'Sabarimala Sannidhanam')
        self.assertEqual(data['temple']['bank_account_number'], '570012345678')

        # Now verify temple admin can login with these created credentials
        login_res = self.client.post(
            '/api/admin/login/',
            data=json.dumps({'email': 'contact@sabarimala.org', 'password': 'templepassword123'}),
            content_type='application/json',
        )
        self.assertEqual(login_res.status_code, 200)
        self.assertEqual(login_res.json()['temple']['short_name'], 'Sabarimala')

    def test_admin_temple_profile_get_and_put(self):
        # Test GET with X-Temple-ID header
        res = self.client.get('/api/admin/temple/', HTTP_X_TEMPLE_ID=str(self.temple.id))
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data['temple']['id'], self.temple.id)
        self.assertEqual(data['temple']['name'], 'Test Temple')

        # Test PUT update (including attempting to modify bank details which must be ignored)
        update_res = self.client.put(
            '/api/admin/temple/',
            data=json.dumps({
                'name': 'Updated Bhuvaneswari Temple',
                'short_name': 'Updated Temple',
                'city': 'Kochi',
                'slogan_ml': 'പുതിയ സ്ലോഗൻ',
                'bank_account_number': 'HACKED_ACCOUNT_99999',
            }),
            content_type='application/json',
            HTTP_X_TEMPLE_ID=str(self.temple.id),
        )
        self.assertEqual(update_res.status_code, 200)
        updated = update_res.json()['temple']
        self.assertEqual(updated['name'], 'Updated Bhuvaneswari Temple')
        self.assertEqual(updated['short_name'], 'Updated Temple')
        self.assertEqual(updated['city'], 'Kochi')
        self.assertEqual(updated['slogan_ml'], 'പുതിയ സ്ലോഗൻ')

        # Verify in DB that bank details were NOT changed
        self.temple.refresh_from_db()
        self.assertEqual(self.temple.bank_account_number, '1234567890')

        # Test slogan_ml exceeding 121 characters is rejected
        too_long_slogan = 'അ' * 122
        long_res = self.client.put(
            '/api/admin/temple/',
            data=json.dumps({'slogan_ml': too_long_slogan}),
            content_type='application/json',
            HTTP_X_TEMPLE_ID=str(self.temple.id),
        )
        self.assertEqual(long_res.status_code, 400)
        self.assertIn('121', long_res.json()['message'])

    def test_admin_logout(self):
        res = self.client.post('/api/admin/logout/')
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()['success'])

    def test_public_default_temple(self):
        res = self.client.get('/api/temples/public/')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['temple']['id'], self.temple.id)
        self.assertNotIn('bank_account_number', data['temple'])

    def test_public_temple_lookup_by_slug_and_short_name(self):
        # Lookup by exact slug
        res = self.client.get(f'/api/temples/public/{self.temple.slug}/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['temple']['name'], 'Test Temple')

        # Lookup by short_name
        res = self.client.get('/api/temples/public/Test/')
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()['temple']['name'], 'Test Temple')

        # Lookup not found
        res = self.client.get('/api/temples/public/non-existent-temple/')
        self.assertEqual(res.status_code, 404)

    def test_upload_logo_success(self):
        png_content = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4'
        file = SimpleUploadedFile("temple_logo.png", png_content, content_type="image/png")
        res = self.client.post('/api/upload/temple-logo/', {'logo': file}, HTTP_X_TEMPLE_ID=str(self.temple.id))
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data['success'])
        self.assertIn('/media/temple_logos/logo_', data['logo_url'])

    def test_upload_logo_exceeds_5mb(self):
        # 5 MB + 1 byte
        big_content = b'0' * (5 * 1024 * 1024 + 1)
        file = SimpleUploadedFile("big_logo.png", big_content, content_type="image/png")
        res = self.client.post('/api/upload/temple-logo/', {'logo': file})
        self.assertEqual(res.status_code, 400)
        self.assertIn('5 MB', res.json()['error'])

    def test_upload_logo_invalid_extension(self):
        file = SimpleUploadedFile("bad_file.txt", b"hello world", content_type="text/plain")
        res = self.client.post('/api/upload/temple-logo/', {'logo': file})
        self.assertEqual(res.status_code, 400)
        self.assertIn('Unsupported image format', res.json()['error'])

    def test_upload_logo_missing_file(self):
        res = self.client.post('/api/upload/temple-logo/', {})
        self.assertEqual(res.status_code, 400)
        self.assertIn('No image file provided', res.json()['error'])


