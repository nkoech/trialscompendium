from rest_framework.serializers import (
    ModelSerializer,
    SerializerMethodField
)
from trialscompendium.trials.api.plot.plotserializers import plot_serializers
from trialscompendium.trials.models import Treatment
from trialscompendium.utils.hyperlinkedidentity import hyperlinked_identity
from trialscompendium.utils.serializersutils import FieldMethodSerializer, get_related_content

plot_serializers = plot_serializers()


def treatment_serializers():
    """
    Treatment serializers
    :return: All treatment serializers
    :rtype: Object
    """

    class TreatmentBaseSerializer(ModelSerializer):
        """
        Base serializer for DRY implementation.
        """

        class Meta:
            model = Treatment
            fields = [
                'id',
                'no_replicate',
                'nitrogen_treatment',
                'phosphate_treatment',
                'tillage_practice',
                'cropping_system',
                'crops_grown',
                'farm_yard_manure',
                'farm_residue',
            ]

    class TreatmentRelationBaseSerializer(ModelSerializer):
        """
        Base serializer for DRY implementation.
        """
        plots = SerializerMethodField()

        class Meta:
            model = Treatment
            fields = [
                'plots',
            ]

    class TreatmentFieldMethodSerializer:
        """
        Serialize an object based on a provided field
        """
        def get_plots(self, obj):
            """
            :param obj: Current record object
            :return: Plot of a treatment
            :rtype: Object/record
            """
            request = self.context['request']
            PlotListSerializer = plot_serializers['PlotListSerializer']
            related_content = get_related_content(
                obj, PlotListSerializer, obj.plot_relation, request
            )
            return related_content

    class TreatmentListSerializer(
        TreatmentBaseSerializer,
        TreatmentRelationBaseSerializer,
        TreatmentFieldMethodSerializer
    ):
        """
        Serialize all records in given fields into an API
        """
        url = hyperlinked_identity('trials_api:treatment_detail', 'pk')

        class Meta:
            model = Treatment
            fields = TreatmentBaseSerializer.Meta.fields + ['url', ] + \
                     TreatmentRelationBaseSerializer.Meta.fields

    class TreatmentDetailSerializer(
        TreatmentBaseSerializer, TreatmentRelationBaseSerializer,
        FieldMethodSerializer, TreatmentFieldMethodSerializer):
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
            ] + TreatmentRelationBaseSerializer.Meta.fields
            model = Treatment
            fields = TreatmentBaseSerializer.Meta.fields + common_fields
            read_only_fields = ['id', ] + common_fields
    return {
        'TreatmentListSerializer': TreatmentListSerializer,
        'TreatmentDetailSerializer': TreatmentDetailSerializer
    }
