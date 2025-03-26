from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate, get_backends
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import LoginForm, RegistrationForm
from .models import UserProfile
from .decorators import role_required

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request=request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                try:
                    profile = UserProfile.objects.get(user_id=str(user.id))
                    if profile.role == 'teacher':
                        return redirect('teacher_dashboard')
                    elif profile.role == 'admin':
                        return redirect('admin_dashboard')
                    else:
                        return redirect('student_dashboard')
                except UserProfile.DoesNotExist:
                    return redirect('student_dashboard')
    else:
        form = LoginForm()
    return render(request, 'authentication/login.html', {'form': form})

def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Specify the backend explicitly
            backend = get_backends()[0]
            user.backend = f'{backend.__module__}.{backend.__class__.__name__}'
            login(request, user)
            try:
                profile = UserProfile.objects.get(user_id=str(user.id))
                if profile.role == 'teacher':
                    return redirect('teacher_dashboard')
                elif profile.role == 'admin':
                    return redirect('admin_dashboard')
                else:
                    return redirect('student_dashboard')
            except UserProfile.DoesNotExist:
                return redirect('student_dashboard')
    else:
        form = RegistrationForm()
    return render(request, 'authentication/register.html', {'form': form})

@login_required
def logout_view(request):
    logout(request)
    return redirect('login')

@login_required
def profile_view(request):
    try:
        profile = UserProfile.objects.get(user_id=str(request.user.id))
    except UserProfile.DoesNotExist:
        profile = None
    return render(request, 'authentication/profile.html', {'profile': profile})

@login_required
@role_required('teacher', 'admin')
def teacher_dashboard(request):
    return render(request, 'templates/dashboard.html')

@login_required
@role_required('student')
def student_dashboard(request):
    return render(request, 'authentication/student_dashboard.html')

@login_required
@role_required('admin')
def admin_dashboard(request):
    return render(request, 'authentication/admin_dashboard.html')