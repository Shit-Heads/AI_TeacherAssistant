'''
from django.db import models
from django.contrib.auth.models import User
from djongo import models as djongo_models

class UserProfile(models.Model):
    USER_ROLES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Administrator'),
    )
    
    _id = djongo_models.ObjectIdField()
    user_id = models.CharField(max_length=150, unique=True)  # Will store user.id
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=False)
    role = models.CharField(max_length=20, choices=USER_ROLES, default='student')

    objects = djongo_models.DjongoManager()
    
    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"
    
    class Meta:
        db_table = 'user_profiles'
'''