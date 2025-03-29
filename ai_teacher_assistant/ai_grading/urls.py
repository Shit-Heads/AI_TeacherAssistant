from django.urls import path
from . import views

urlpatterns = [
    path('process_json/', views.process_json, name='process_json'), 
    path("submissions_view/", views.submissions_view, name="submissions_view"),
    path("submissions_view/get-submissions/", views.get_submissions, name="get_submissions"),
    path("submissions_view/upload-submission/", views.upload_submission, name="upload_submission"),
    path('submissions_view/get-ai-grading/<str:submission_id>/', views.get_ai_grading, name='get_ai_grading'),
]
 