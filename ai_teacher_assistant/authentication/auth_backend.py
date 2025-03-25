from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from .mongodb import db

class MongoDBAuthBackend(ModelBackend):
    """
    Uses default Django authentication for the user login, 
    but ensures user_profiles exist in MongoDB.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        # Let Django handle password-checking for the core user
        user = super().authenticate(request, username=username, password=password, **kwargs)
        if user:
            try:
                profile = db.user_profiles.find_one({'user_id': str(user.id)})
                if not profile:
                    # Create a new profile if missing
                    new_profile = {
                        'user_id': str(user.id),
                        'username': user.username,
                        'email': user.email,
                        'role': 'student',  # default role
                    }
                    db.user_profiles.insert_one(new_profile)
                return user
            except Exception as e:
                print(f"MongoDBAuthBackend error: {e}")
                return None
        return None