from django.urls import path
from .views import assignments_view, dashbaord

urlpatterns = [
    path('', dashbaord, name='assignments'),  # Ensure this exists
]
