from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from .models import UserProfile

class MongoDBAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        user = super().authenticate(request, username=username, password=password, **kwargs)
        
        if user:
            try:
                profile, created = UserProfile.objects.get_or_create(
                    user_id=str(user.id),
                    defaults={
                        'username': user.username,
                        'email': user.email,
                        'role': 'student'  # Default role
                    }
                )
                return user
            except Exception as e:
                print(f"MongoDB authentication error: {e}")
                return None
        return None