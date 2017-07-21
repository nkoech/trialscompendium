from trialscompendium.trials.models import TrialYield
from trialscompendium.utils.pagination import APILimitOffsetPagination
from trialscompendium.utils.permissions import IsOwnerOrReadOnly
from trialscompendium.utils.viewsutils import DetailViewUpdateDelete, CreateAPIViewHook
from rest_framework.filters import DjangoFilterBackend
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .filters import TrialYieldListFilter
from trialscompendium.trials.api.trialyield.trialyieldserializers import trial_yield_serializers


def trial_yield_views():
    """
    Trial yield views
    :return: All trial yield views
    :rtype: Object
    """
    trial_yield_serializer = trial_yield_serializers()

    class TrialYieldCreateAPIView(CreateAPIViewHook):
        """
        Creates a single record.
        """
        queryset = TrialYield.objects.all()
        serializer_class = trial_yield_serializer['TrialYieldDetailSerializer']
        permission_classes = [IsAuthenticated]

    class TrialYieldListAPIView(ListAPIView):
        """
        API list view. Gets all records API.
        """
        queryset = TrialYield.objects.all()
        serializer_class = trial_yield_serializer['TrialYieldListSerializer']
        filter_backends = (DjangoFilterBackend,)
        filter_class = TrialYieldListFilter
        pagination_class = APILimitOffsetPagination

    class TrialYieldDetailAPIView(DetailViewUpdateDelete):
        """
        Updates a record.
        """
        queryset = TrialYield.objects.all()
        serializer_class = trial_yield_serializer['TrialYieldDetailSerializer']
        permission_classes = [IsAuthenticated, IsAdminUser]
        lookup_field = 'pk'

    return {
        'TrialYieldListAPIView': TrialYieldListAPIView,
        'TrialYieldDetailAPIView': TrialYieldDetailAPIView,
        'TrialYieldCreateAPIView': TrialYieldCreateAPIView
    }

