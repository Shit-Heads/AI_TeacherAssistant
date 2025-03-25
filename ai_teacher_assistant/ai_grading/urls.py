from django.urls import path
from . import views

urlpatterns = [
    #path('', views.chat_view, name='chat'),  # Render chat.html at /ai/
    #path('ask', views.ask, name='ask'),  # POST request handling for AI interaction
    path('upload/', views.upload_view, name='upload_view'),  
    path('process_json/', views.process_json, name='process_json'), 
]
