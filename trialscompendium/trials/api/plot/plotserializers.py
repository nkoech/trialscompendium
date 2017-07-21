from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField
)
from trialscompendium.trials.api.trialyield.trialyieldserializers import trial_yield_serializers
from trialscompendium.trials.models import Plot, Treatment
from trialscompendium.utils.hyperlinkedidentity import hyperlinked_identity
from trialscompendium.utils.serializersutils import (
    FieldMethodSerializer,
    get_related_content_url,
    get_related_content,
)

trial_yield_serializers = trial_yield_serializers()


def plot_serializers():
    """
    Plot serializers
    :return: All plot serializers
    :rtype: Object
    """

    class PlotBaseSerializer(ModelSerializer):
        """
        Base serializer for DRY implementation.
        """
        class Meta:
            model = Plot
            fields = [
                'id',
                'trial_id',
                'plot_id',
                'sub_plot_id',
                'treatment',
            ]

    class PlotRelationBaseSerializer(ModelSerializer):
        """
        Base serializer for DRY implementation.
        """
        treatment_url = SerializerMethodField()
        trial_yield = SerializerMethodField()

        class Meta:
            model = Plot
            fields = [
                'treatment_url',
                'trial_yield',
            ]

    class PlotFieldMethodSerializer:
        """
        Serialize an object based on a provided field
        """
        def get_treatment_url(self, obj):
            """
            Get related content type/object url
            :param obj: Current record object
            :return: URL to related object
            :rtype: String
            """
            if obj.treatment:
                return get_related_content_url(Treatment, obj.treatment.id)

        def get_trial_yield(self, obj):
            """
            :param obj: Current record object
            :return: Trial yield of the plot record
            :rtype: Object/record
            """
            request = self.context['request']
            TrialYieldListSerializer = trial_yield_serializers['TrialYieldListSerializer']
            related_content = get_related_content(
                obj, TrialYieldListSerializer, obj.trial_yield_relation, request
            )
            return related_content

    class PlotListSerializer(
        PlotBaseSerializer,
        PlotRelationBaseSerializer,
        PlotFieldMethodSerializer,
    ):
        """
        Serialize all records in given fields into an API
        """
        url = hyperlinked_identity('trials_api:plot_detail', 'slug')

        class Meta:
            model = Plot
            fields = PlotBaseSerializer.Meta.fields + ['url', ] + \
                     PlotRelationBaseSerializer.Meta.fields

    class PlotDetailSerializer(
        PlotBaseSerializer, PlotRelationBaseSerializer,
        FieldMethodSerializer, PlotFieldMethodSerializer
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
            ] + PlotRelationBaseSerializer.Meta.fields
            model = Plot
            fields = PlotBaseSerializer.Meta.fields + common_fields
            read_only_fields = ['id', ] + common_fields
    return {
        'PlotListSerializer': PlotListSerializer,
        'PlotDetailSerializer': PlotDetailSerializer
    }
