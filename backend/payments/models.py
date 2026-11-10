from django.db import models
from temples.models import Temple


class Payment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]

    temple = models.ForeignKey(
        Temple, on_delete=models.CASCADE, related_name='payments'
    )
    order_id = models.CharField(max_length=120, unique=True, db_index=True)
    cf_order_id = models.CharField(max_length=120, blank=True, default='')
    payment_id = models.CharField(max_length=120, blank=True, default='')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='INR')
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='PENDING', db_index=True
    )
    gateway = models.CharField(max_length=50, default='cashfree')
    payment_method = models.CharField(max_length=50, default='UPI')

    donor_name = models.CharField(max_length=150, blank=True, default='Devotee')
    donor_phone = models.CharField(max_length=50, blank=True, default='')
    donor_email = models.CharField(max_length=150, blank=True, default='')
    is_tax_exempt_80g = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.order_id} - ₹{self.amount} ({self.status}) - {self.temple.name}"

    def to_dict(self):
        status_label = self.status.capitalize() if self.status else 'Pending'
        ref = self.order_id
        if ref.startswith('order_'):
            parts = ref.split('_')
            ref = f"#{parts[-1][:8]}"
        elif not ref.startswith('#'):
            ref = f"#{ref[:8]}"

        return {
            'id': self.id,
            'order_id': self.order_id,
            'ref': ref,
            'cf_order_id': self.cf_order_id,
            'payment_id': self.payment_id,
            'amount': float(self.amount),
            'currency': self.currency,
            'status': status_label,
            'gateway': self.gateway,
            'payment_method': self.payment_method,
            'donor_name': self.donor_name or 'Devotee',
            'donor_phone': self.donor_phone,
            'donor_email': self.donor_email,
            'is_tax_exempt_80g': self.is_tax_exempt_80g,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
