from django.db import models
from django.contrib.auth.models import User


class Temple(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='temple'
    )
    # Identity
    name = models.CharField(max_length=255, help_text="Temple name in English")
    name_ml = models.CharField(
        max_length=255, blank=True, default='', help_text="Temple name in Malayalam"
    )
    short_name = models.CharField(max_length=100, blank=True, default='')
    primary_language = models.CharField(max_length=10, default='ml')

    # Assets (optional)
    logo_url = models.TextField(blank=True, default='', help_text="Logo URL or asset path")

    # Contact Details
    phone = models.CharField(max_length=50, blank=True, default='')
    whatsapp = models.CharField(max_length=50, blank=True, default='')
    email = models.EmailField(help_text="Login and contact email")

    # Location
    street_address = models.CharField(max_length=255, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    state = models.CharField(max_length=100, default='Kerala')
    pin_code = models.CharField(max_length=20, blank=True, default='')
    gstin = models.CharField(max_length=50, blank=True, default='')

    # Slogans & Darshan (optional)
    slogan_ml = models.CharField(max_length=255, blank=True, default='')
    slogan_en = models.CharField(max_length=255, blank=True, default='')
    darshan_video_url = models.TextField(blank=True, default='')
    darshan_thumbnail_url = models.TextField(blank=True, default='')
    darshan_message_template = models.TextField(
        blank=True,
        default="Namaste! Your offering of ₹{amount} to {temple} is received. Watch your darshan: {link}",
    )

    # Bank Details (Mandatory & Superadmin-only)
    bank_name = models.CharField(max_length=150, help_text="Bank Name")
    bank_account_holder = models.CharField(max_length=255, help_text="Registered Payee / Account Holder Name")
    bank_account_number = models.CharField(max_length=100, help_text="Account Number")
    bank_ifsc = models.CharField(max_length=30, help_text="IFSC Code")
    upi_id = models.CharField(max_length=150, blank=True, default='', help_text="Temple UPI ID / VPA")

    # System Status & Timestamps
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.short_name or self.email})"

    def to_dict(self, include_bank=True):
        data = {
            'id': self.id,
            'name': self.name,
            'name_ml': self.name_ml,
            'short_name': self.short_name,
            'primary_language': self.primary_language,
            'logo_url': self.logo_url,
            'phone': self.phone,
            'whatsapp': self.whatsapp,
            'email': self.email,
            'street_address': self.street_address,
            'city': self.city,
            'state': self.state,
            'pin_code': self.pin_code,
            'gstin': self.gstin,
            'slogan_ml': self.slogan_ml,
            'slogan_en': self.slogan_en,
            'darshan_video_url': self.darshan_video_url,
            'darshan_thumbnail_url': self.darshan_thumbnail_url,
            'darshan_message_template': self.darshan_message_template,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'username': self.user.username if self.user else None,
        }
        if include_bank:
            data.update({
                'bank_name': self.bank_name,
                'bank_account_holder': self.bank_account_holder,
                'bank_account_number': self.bank_account_number,
                'bank_ifsc': self.bank_ifsc,
                'upi_id': self.upi_id,
            })
        return data
