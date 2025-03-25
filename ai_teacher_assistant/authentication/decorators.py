from django.shortcuts import redirect
from functools import wraps
from .models import UserProfile

def role_required(*roles):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if request.user.is_authenticated:
                try:
                    profile = UserProfile.objects.get(user_id=str(request.user.id))
                    if profile.role in roles:
                        return view_func(request, *args, **kwargs)
                    else:
                        if profile.role == 'student':
                            return redirect('student_dashboard')
                        elif profile.role == 'teacher':
                            return redirect('teacher_dashboard')
                        elif profile.role == 'admin':
                            return redirect('admin_dashboard')
                except UserProfile.DoesNotExist:
                    return redirect('login')
            return redirect('login')
        return _wrapped_view
    return decorator