from trialscompendium.trials.models import Plot
from trialscompendium.utils.pagination import APILimitOffsetPagination
from trialscompendium.utils.permissions import IsOwnerOrReadOnly
from trialscompendium.utils.viewsutils import DetailViewUpdateDelete, CreateAPIViewHook
from rest_framework.filters import DjangoFilterBackend
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .filters import PlotListFilter
from trialscompendium.trials.api.plot.plotserializers import plot_serializers


def plot_views():
    """
    Plot views
    :return: All plot views
    :rtype: Object
    """
    plot_serializer = plot_serializers()

    class PlotCreateAPIView(CreateAPIViewHook):
        """
        Creates a single record.
        """
        queryset = Plot.objects.all()
        serializer_class = plot_serializer['PlotDetailSerializer']
        permission_classes = [IsAuthenticated]

    class PlotListAPIView(ListAPIView):
        """
        API list view. Gets all records API.
        """
        queryset = Plot.objects.all()
        serializer_class = plot_serializer['PlotListSerializer']
        filter_backends = (DjangoFilterBackend,)
        filter_class = PlotListFilter
        pagination_class = APILimitOffsetPagination

    class PlotDetailAPIView(DetailViewUpdateDelete):
        """
        Updates a record.
        """
        queryset = Plot.objects.all()
        serializer_class = plot_serializer['PlotDetailSerializer']
        permission_classes = [IsAuthenticated, IsAdminUser]
        lookup_field = 'slug'

    return {
        'PlotListAPIView': PlotListAPIView,
        'PlotDetailAPIView': PlotDetailAPIView,
        'PlotCreateAPIView': PlotCreateAPIView
    }
