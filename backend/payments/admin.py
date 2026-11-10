from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'temple', 'amount', 'status', 'gateway', 'payment_method', 'created_at')
    list_filter = ('status', 'gateway', 'temple', 'created_at')
    search_fields = ('order_id', 'cf_order_id', 'payment_id', 'donor_name', 'donor_phone')
    ordering = ('-created_at',)
