from django.contrib import admin
from .models import Temple


@admin.register(Temple)
class TempleAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'city', 'state', 'upi_id', 'is_active', 'created_at')
    search_fields = ('name', 'name_ml', 'email', 'upi_id', 'city')
    list_filter = ('is_active', 'state', 'primary_language')
