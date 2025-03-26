from django.urls import path
from . import views

urlpatterns = [
    #path('', views.chat_view, name='chat'),  # Render chat.html at /ai/
    #path('ask', views.ask, name='ask'),  # POST request handling for AI interaction
    # path('', views.upload_view, name='upload_view'),
    path('process_json/', views.process_json, name='process_json'), 
    path("submissions_view/", views.submissions_view, name="submissions_view"),
    path("submissions_view/get-submissions/", views.get_submissions, name="get_submissions"),
    path("submissions_view/upload-submission/", views.upload_submission, name="upload_submission"),
    
]
 