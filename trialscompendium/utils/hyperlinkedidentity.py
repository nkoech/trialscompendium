from django.core.exceptions import ImproperlyConfigured
from rest_framework.serializers import HyperlinkedIdentityField
from django.http import HttpResponse


def hyperlinked_identity(view_name, lookup_field=None):
    """
    :param view_name: Api view name. Include namespace if used
    :param lookup_field: Identity field. Defaults to id if not provided
    :return: Reverse API URL
    :rtype: string
    """
    url = HyperlinkedIdentityField(
        view_name=view_name,
        lookup_field=lookup_field
        )
    return url
