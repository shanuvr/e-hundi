from django.urls import path
from . import views

urlpatterns = [
    # Superadmin authentication
    path('superadmin/login/', views.superadmin_login_view, name='superadmin-login'),
    path('superadmin/me/', views.superadmin_me_view, name='superadmin-me'),
    path('superadmin/logout/', views.superadmin_logout_view, name='superadmin-logout'),

    # Superadmin temple CRUD
    path('superadmin/temples/', views.temples_list_create_view, name='superadmin-temples-list-create'),
    path('superadmin/temples/<int:pk>/', views.temple_detail_update_delete_view, name='superadmin-temple-detail'),
    path('superadmin/temples/<int:pk>/toggle-status/', views.temple_toggle_status_view, name='superadmin-temple-toggle-status'),

    # Temple Admin Authentication & Profile (/admin)
    path('admin/login/', views.admin_login_view, name='admin-login'),
    path('admin/temple/', views.admin_temple_profile_view, name='admin-temple-profile'),
]
