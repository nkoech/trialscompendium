from __future__ import unicode_literals

from django.conf import settings
from django.db import models
from decimal import Decimal


class AuthUserDetail(models.Model):
    """
    Abstract model
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
    modified_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='%(app_label)s_%(class)s', default=1)

    class Meta:
        abstract = True


class CreateUpdateTime(models.Model):
    """
    Model update and creation time abstract model.
    """
    last_update = models.DateTimeField(auto_now=True, auto_now_add=False)
    time_created = models.DateTimeField(auto_now=False, auto_now_add=True)

    class Meta:
        abstract = True
