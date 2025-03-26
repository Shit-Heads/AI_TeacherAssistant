from django.urls import path
from .views import assignments_view, create_assignment, get_assignments, delete_assignment, dashboard

urlpatterns = [
    path("", dashboard, name="teachdash"),
    path("assignments/", assignments_view, name="assignments_view"),
    path("assignment/create-assignment/", create_assignment, name="create_assignment"),
    path("assignment/get-assignments/", get_assignments, name="get_assignments"),
    path("assignment/delete-assignment/<str:assignment_id>/", delete_assignment, name="delete_assignment"),
]
