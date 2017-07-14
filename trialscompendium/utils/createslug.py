from django.utils.text import slugify


def create_slug(instance, model_type=None, instance_field=None):
    """
    Create a slug from country name.
    :param instance: Object instance
    :param model_type: Name of model
    :param instance_field: Field to be slugified
    :param new_slug: Newly created slug
    :return: Unique slug
    :rtype: string
    """
    slug = None
    max_length = model_type._meta.get_field('slug').max_length
    if type(instance_field) is list:
        for i in instance_field:
            i = str(i)
            if slug:
                slug += '-' + slugify(i)
            else:
                slug = slugify(i)
        slug = slug[:max_length]
    else:
        slug = slugify(str(instance_field)[:max_length])
    qs = model_type.objects.filter(slug=slug).order_by('-id')
    if qs.exists():
        qs_latest = model_type.objects.latest('slug')
        qs_id = qs_latest.id
        slug = '{0}-{1}'.format(slug[:max_length - len(str(qs_id)) - 1], qs_id + 1)
    return slug




