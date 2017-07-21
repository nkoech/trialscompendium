from trialscompendium.trials.models import (
    TrialYield,
    Plot,
)
from trialscompendium.utils.hyperlinkedidentity import hyperlinked_identity
from trialscompendium.utils.serializersutils import (
    FieldMethodSerializer,
    get_related_content_url,
)
from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField
)


def trial_yield_serializers():
    """
    Trial yield serializers
    :return: All trial yield serializers
    :rtype: Object
    """

    class TrialYieldBaseSerializer(ModelSerializer):
        """
        Base serializer for DRY implementation.
        """
        class Meta:
            model = TrialYield
            fields = [
                'id',
                'plot',
                'observation',
                'year',
                'season',
                'trial_yield',
            ]

    class TrialYieldRelationBaseSerializer(ModelSerializer):
        """
        Base serializer for DRY implementation.
        """
        plot_url = SerializerMethodField()

        class Meta:
            model = TrialYield
            fields = [
                'plot_url',
            ]

    class TrialYieldFieldMethodSerializer:
        """
        Serialize an object based on a provided field
        """
        def get_plot_url(self, obj):
            """
            Get related content type/object url
            :param obj: Current record object
            :return: URL to related object
            :rtype: String
            """
            if obj.plot:
                return get_related_content_url(Plot, obj.plot.id)

    class TrialYieldListSerializer(
        TrialYieldBaseSerializer,
        TrialYieldRelationBaseSerializer,
        TrialYieldFieldMethodSerializer
    ):
        """
        Serialize all records in given fields into an API
        """
        url = hyperlinked_identity('trials_api:trial_yield_detail', 'pk')

        class Meta:
            model = TrialYield
            fields = TrialYieldBaseSerializer.Meta.fields + ['url', ] + \
                     TrialYieldRelationBaseSerializer.Meta.fields

    class TrialYieldDetailSerializer(
        TrialYieldBaseSerializer, TrialYieldRelationBaseSerializer,
        FieldMethodSerializer, TrialYieldFieldMethodSerializer
    ):
        """
        Serialize single record into an API. This is dependent on fields given.
        """
        user = SerializerMethodField()
        modified_by = SerializerMethodField()

        class Meta:
            common_fields = [
                'user',
                'modified_by',
                'last_update',
                'time_created',
            ] + TrialYieldRelationBaseSerializer.Meta.fields
            model = TrialYield
            fields = TrialYieldBaseSerializer.Meta.fields + common_fields
            read_only_fields = ['id', ] + common_fields
    return {
        'TrialYieldListSerializer': TrialYieldListSerializer,
        'TrialYieldDetailSerializer': TrialYieldDetailSerializer
    }
