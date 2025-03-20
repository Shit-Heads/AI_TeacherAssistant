from rest_framework import permissions

class IsTeacher(permissions.BasePermission):
    """
    Custom permission to only allow users in the 'Teacher' group to edit objects.
    Assumes that users who are teachers belong to a Django group named 'Teacher'.
    """

    def has_permission(self, request, view):
        # SAFE_METHODS are GET, HEAD, OPTIONS.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write methods are only allowed if user is in the Teacher group.
        return request.user.groups.filter(name="Teacher").exists()