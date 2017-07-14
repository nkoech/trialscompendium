from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
    Check if the object is owned by the current user
    """

    message = 'You must be the owner of this object'

    def has_object_permission(self, request, view, obj):
        """
        Check if request method has permission in raletion
        to safe methods and grant permission
        :param request: client request
        :param view: application view
        :param obj: application object - current record
        :return: Grant access to object if true otherwise do
                 not grant permission
        :rtype: object creator
        """
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user
