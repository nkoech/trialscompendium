from rest_framework.filters import (
    FilterSet
)
from trialscompendium.trials.models import Plot


class PlotListFilter(FilterSet):
    """
    Filter query list from plot database
    """
    class Meta:
        model = Plot
        fields = {'id': ['exact', 'in'],
                  'trial_id': ['iexact', 'in', 'icontains'],
                  'plot_id': ['iexact', 'in', 'icontains'],
                  'sub_plot_id': ['iexact', 'in', 'icontains'],
                  'treatment': ['exact', 'in'],
                  }
        order_by = ['plot_id']

