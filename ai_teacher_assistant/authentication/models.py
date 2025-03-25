from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    USER_ROLES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Administrator'),
    )
    
    # Set user_id as the primary key.
    user_id = models.CharField(max_length=150, primary_key=True)
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=False)
    role = models.CharField(max_length=20, choices=USER_ROLES, default='student')

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"

    class Meta:
        db_table = 'user_profiles'