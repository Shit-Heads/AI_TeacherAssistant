import logging
from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseServerError, Http404
from django.contrib.auth import get_backends
from .forms import LoginForm, RegistrationForm
from .mongodb import db

logger = logging.getLogger(__name__)

def login_view(request):
    """
    Handle user login using Django’s built-in authentication.
    Falls back to a custom profile in MongoDB.
    """
    try:
        if request.method == 'POST':
            form = LoginForm(request=request, data=request.POST)
            if form.is_valid():
                user = form.get_user()
                if user:
                    # Specify the backend explicitly
                    backend = get_backends()[0]
                    user.backend = f'{backend.__module__}.{backend.__class__.__name__}'
                    login(request, user)
                    profile = db.user_profiles.find_one({'user_id': str(user.id)})
                    if profile:
                        role = profile.get('role', 'student')
                        if role == 'teacher':
                            return redirect('teacher_dashboard')
                        elif role == 'admin':
                            return redirect('admin_dashboard')
                    return redirect('student_dashboard')
        else:
            form = LoginForm()
        return render(request, 'authentication/login.html', {'form': form})
    except Exception as e:
        logger.error(f"Login error: {e}", exc_info=True)
        return HttpResponseServerError("An error occurred during login.")

def register_view(request):
    """
    Handle user registration using Django’s built-in User model.
    Also creates or updates a MongoDB profile entry.
    """
    try:
        if request.method == 'POST':
            form = RegistrationForm(request.POST)
            if form.is_valid():
                new_user = form.save()
                # Specify the backend explicitly
                backend = get_backends()[0]
                new_user.backend = f'{backend.__module__}.{backend.__class__.__name__}'
                login(request, new_user)
                
                # Ensure a MongoDB profile exists:
                existing_profile = db.user_profiles.find_one({'user_id': str(new_user.id)})
                if not existing_profile:
                    db.user_profiles.insert_one({
                        'user_id': str(new_user.id),
                        'username': new_user.username,
                        'email': new_user.email,
                        'role': 'student',  # default role
                    })
                return redirect('login')
        else:
            form = RegistrationForm()
        return render(request, 'authentication/register.html', {'form': form})
    except Exception as e:
        logger.error(f"Registration error: {e}", exc_info=True)
        return HttpResponseServerError("An error occurred during registration.")

@login_required
def logout_view(request):
    """
    Log the user out of the current session.
    """
    logout(request)
    return redirect('login')

@login_required
def profile_view(request):
    """
    Display the MongoDB-based user profile.
    Raises 404 if the profile is missing.
    """
    try:
        profile = db.user_profiles.find_one({'user_id': str(request.user.id)})
        if not profile:
            raise Http404("Profile not found.")
        return render(request, 'authentication/profile.html', {'profile': profile})
    except Http404:
        raise
    except Exception as e:
        logger.error(f"Profile error: {e}", exc_info=True)
        return HttpResponseServerError("An error occurred while retrieving the profile.")

@login_required
def teacher_dashboard(request):
    """
    Display the teacher dashboard if the user's role is teacher.
    """
    try:
        profile = db.user_profiles.find_one({'user_id': str(request.user.id)})
        if not profile or profile.get('role') != 'teacher':
            return redirect('student_dashboard')
        return render(request, 'authentication/teacher_dashboard.html')
    except Exception as e:
        logger.error(f"Teacher dashboard error: {e}", exc_info=True)
        return HttpResponseServerError("An error occurred loading the teacher dashboard.")

@login_required
def student_dashboard(request):
    """
    Display the student dashboard if the user's role is student.
    """
    try:
        profile = db.user_profiles.find_one({'user_id': str(request.user.id)})
        return render(request, 'authentication/student_dashboard.html')
    except Exception as e:
        logger.error(f"Student dashboard error: {e}", exc_info=True)
        return HttpResponseServerError("An error occurred loading the student dashboard.")

@login_required
def admin_dashboard(request):
    """
    Display the admin dashboard if the user's role is admin.
    """
    try:
        profile = db.user_profiles.find_one({'user_id': str(request.user.id)})
        if not profile or profile.get('role') != 'admin':
            return redirect('student_dashboard')
        return render(request, 'authentication/admin_dashboard.html')
    except Exception as e:
        logger.error(f"Admin dashboard error: {e}", exc_info=True)
        return HttpResponseServerError("An error occurred loading the admin dashboard.")