from .models import UserProfile

def user_context(request):
    if request.user.is_authenticated:
        try:
            profile = UserProfile.objects.get(user_id=request.user.id)
        except UserProfile.DoesNotExist:
            profile = None
        return {
            'username': request.user.username,
            'profile': profile,
        }
    return {}