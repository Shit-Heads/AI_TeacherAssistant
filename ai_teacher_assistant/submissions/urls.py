from django.urls import path
from . import views
from .views import submitted_assignments

urlpatterns=[
    # path('',views.dashboard,name='dashboard'),
    path('', views.submissions_home, name='submissions'),
    # path('dashboard/',views.dashboard,name='dashboard'),
    path('pending/', views.pending_submissions, name='pending_submissions'),
    path('submissions/my-submissions/', views.submissions, name='user_submissions'),
    path('submissions/submitted/', submitted_assignments, name='submitted_assignments'),
    path('get_submission_details/<str:assignment_id>/', views.get_submission_details, name='get_submission_details'),
]