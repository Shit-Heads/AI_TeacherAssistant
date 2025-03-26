from django.urls import path
from . import views

urlpatterns=[
    # path('',views.dashboard,name='dashboard'),
    path('', views.submissions_home, name='submissions'),
    # path('dashboard/',views.dashboard,name='dashboard'),
    path('pending/', views.pending_submissions, name='pending_submissions'),
    # path('submissions/my-submissions/', views.user_submissions, name='user_submissions'),
]