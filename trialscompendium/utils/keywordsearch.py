from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.db.models import Q
import re


def get_project_models(proj):
    """
    :param proj: Project name
    :return: model class
    :rtype: Class object
    """

    third_party_apps = ([app.rsplit('.')[-1] for app in settings.INSTALLED_APPS if proj not in app])
    for ct in ContentType.objects.all():
        if ct.app_label not in third_party_apps:
            yield ct.model_class()


def get_query(query_string, obj=None, ):
    """
    Complex keyword queries using Django Q objects
    :param query_string: Keyword string to be searched
    :param obj: Object that could either be a model, tuple or list
    :return: Object query based on keyword string otherwise return None 
    :rtype: Object
    """
    query = None
    terms = _normalize_keyword(query_string)
    if not (isinstance(obj, tuple) or isinstance(obj, list)):
        obj = _get_search_fields(obj)
    if obj and terms:
        for term in terms:
            or_query = None  # Query to search for a given term in each field
            for field in obj:
                q = Q(**{"{0}__icontains".format(field): term})
                or_query = q if or_query is None else or_query | q
            query = or_query if query is None else query & or_query
        return query
    else:
        return None


def _get_search_fields(model):
    """
    Get search fields from a model
    :param model: Model object
    :return: Return list of fields otherwise return None
    """
    search_fields = []
    field_types = ['Slugfield', 'Foreignkey']
    fields_names = ['object_id', 'content_object', 'time_created', 'last_update', 'id']
    try:
        if model:
            for field in model._meta.get_fields():
                verbose_name = getattr(field, 'verbose_name', None)
                if verbose_name:
                    field_name = str(field.name)
                    field_type = str(field.get_internal_type().title())
                    if field_name not in fields_names and field_type not in field_types:
                        search_fields.append(field_name)
            return search_fields
    except AssertionError:
        return None


def _normalize_keyword(
        query_string,
        findterms=re.compile(r'"([^"]+)"|(\S+)').findall,
        normspace=re.compile(r'\s{2,}').sub
):
    """
    Breaks the string into a list based on spaces and double quotes
    :param query_string: String to be normalized
    :param findterms: Return all non-overlapping matches of regex pattern in string, as a list of strings
    :param normspace: Return the string obtained by replacing the leftmost non-overlapping occurrences of 
                      regex pattern in string by replacement
    :return: Normalized keywords in a list
    """
    return [normspace('', (t[0] or t[1]).strip()) for t in findterms(query_string)]