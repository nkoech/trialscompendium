from trialscompendium.trials.models import Treatment
from trialscompendium.utils.pagination import APILimitOffsetPagination
from trialscompendium.utils.permissions import IsOwnerOrReadOnly
from trialscompendium.utils.viewsutils import DetailViewUpdateDelete, CreateAPIViewHook
from rest_framework.filters import DjangoFilterBackend
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .filters import TreatmentListFilter
from trialscompendium.trials.api.treatment.treatmentserializers import treatment_serializers


def treatment_views():
    """
    Treatment views
    :return: All treatment views
    :rtype: Object
    """
    treatment_serializer = treatment_serializers()

    class TreatmentCreateAPIView(CreateAPIViewHook):
        """
        Creates a single record.
        """
        queryset = Treatment.objects.all()
        serializer_class = treatment_serializer['TreatmentDetailSerializer']
        permission_classes = [IsAuthenticated]

    class TreatmentListAPIView(ListAPIView):
        """
        API list view. Gets all records API.
        """
        queryset = Treatment.objects.all()
        serializer_class = treatment_serializer['TreatmentListSerializer']
        filter_backends = (DjangoFilterBackend,)
        filter_class = TreatmentListFilter
        pagination_class = APILimitOffsetPagination

    class TreatmentDetailAPIView(DetailViewUpdateDelete):
        """
        Updates a record.
        """
        queryset = Treatment.objects.all()
        serializer_class = treatment_serializer['TreatmentDetailSerializer']
        permission_classes = [IsAuthenticated, IsAdminUser]
        lookup_field = 'pk'

    return {
        'TreatmentListAPIView': TreatmentListAPIView,
        'TreatmentDetailAPIView': TreatmentDetailAPIView,
        'TreatmentCreateAPIView': TreatmentCreateAPIView
    }
