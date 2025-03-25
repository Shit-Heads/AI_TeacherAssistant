from django.urls import path
from .views import assignments_view

urlpatterns = [
    path('', assignments_view, name='assignments_view'),  # Ensure this exists
]
