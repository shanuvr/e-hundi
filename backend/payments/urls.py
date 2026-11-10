from django.urls import path
from .views import create_order, verify_payment, admin_dashboard_view

urlpatterns = [
    path('api/create-order/', create_order, name='create_order'),
    path('api/verify-payment/', verify_payment, name='verify_payment'),
    path('api/admin/dashboard/', admin_dashboard_view, name='admin_dashboard'),
]
