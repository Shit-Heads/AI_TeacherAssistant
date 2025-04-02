from django.urls import path
from . import views
from .views import assignments_view, create_assignment, get_assignments, delete_assignment, dashboard

urlpatterns = [
    path("", dashboard, name="teachdash"),
    path("createsub/",views.createsub,name="createsub"),
    path("get-subjects/", views.get_subjects, name="get_assignments"),
    path("assignments/", assignments_view, name="assignments_view"),
    path("assignments/create-assignment/", create_assignment, name="create_assignment"),
    path("assignments/get-assignments/", get_assignments, name="get_assignments"),
    path("assignments/delete-assignment/<str:assignment_id>/", delete_assignment, name="delete_assignment"),
]
