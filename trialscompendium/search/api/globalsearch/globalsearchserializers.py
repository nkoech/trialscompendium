from rest_framework.serializers import ModelSerializer


def global_search_serializers():
    """
    Global search serializers
    :return: All global search serializers
    :rtype: Object
    """

    class GlobalSearchListSerializer(ModelSerializer):
        """
        Serialize all records in given fields into an API
        """

        class Meta:
            model = None

    return {
        'GlobalSearchListSerializer': GlobalSearchListSerializer
    }
