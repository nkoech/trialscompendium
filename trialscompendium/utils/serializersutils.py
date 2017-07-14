from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from rest_framework.serializers import (
    ValidationError,
    SerializerMethodField
)


class CreateSerializerUtil:
    """
    Utility class that would create a serializer class
    """

    def __init__(self):
        self.model_type = None
        self.key = None
        self.user = None
        self.slugify = None
        self.auth_user = None

    def get_authenticated_user(self, user):
        """
        Get an authenticated user
        :param user: Record owner/creator
        :return: Authenticated user
        :rtype: User object
        """
        if user:
            auth_user = user
        else:
            user_model = get_user_model()
            auth_user = user_model.objects.all().first()
        return auth_user

    def validate(self, data):
        """
        Validates data
        :param data: Input data
        :return: Validated data
        :rtype: Object
        """
        model_type = self.model_type
        model_qs = ContentType.objects.filter(model=model_type)
        self.validation_error(model_qs, 'This is not a valid content type')
        any_model = model_qs.first().model_class()
        if self.slugify:
            obj_qs = any_model.objects.filter(slug=self.key)
            self.validation_error(obj_qs, 'This is not a slug for this content type')
        else:
            obj_qs = any_model.objects.filter(pk=self.key)
            self.validation_error(obj_qs, 'This is not a primary key for this content type')
        return data

    def validation_error(self, qs, error_msg):
        """
        Raises validation error
        :param qs: Model or object queryset
        :param error_msg: Validation error message
        :return: None:
        :rtype: None
        """
        if not qs.exists() or qs.count() != 1:
            raise ValidationError(error_msg)


class FieldMethodSerializer:
    """
    Serialize an object based on a provided field
    """
    def get_user(self, obj):
        """
        :return: Name of user who created the record
        :rtype: String
        """
        return str(obj.user.username)

    def get_modified_by(self, obj):
        """
        :return: Name of user who edited a record
        :rtype: String
        """
        return str(obj.modified_by.username)

    def get_content_type_url(self, obj):
        """
        Get related content type/object url
        :param obj: Current record object
        :return: URL to related object
        :rtype: String
        """
        try:
            return obj.content_object.get_api_url()
        except:
            return None


def get_related_content(obj, serializer, relation_filter, request):
    """
    Gets related content based on type or foreign key
    :param obj: Object/record
    :param serializer: Model serializer
    :param relation_filter: Related data queryset
    :param request: Interface/device request
    :return: Related object/record otherwise return none
    :rtype: Object
    """
    try:
        relation_type = serializer(
            relation_filter,
            context={'request': request},
            many=True
        ).data
        return relation_type
    except obj.DoesNotExist:
        return None


def get_related_content_url(model, related_field):
    """
    Gets related object/content as url based on foreign key
    :param model: Model
    :param related_field: Foreign key field
    :return: Related object/content url
    :rtype: String
    """
    try:
        related_content_obj = model.objects.get(id=related_field)
        return related_content_obj.get_api_url()
    except:
        return None


def valid_integer(obj):
    """
    Validates if input is an integer
    :param obj: Input object. This could be a string or integer
    :return: True if integer
    :return: False if string
    :rtype: Boolean
    """
    if obj:
        try:
            int(obj)
            return True
        except ValueError:
            return False
