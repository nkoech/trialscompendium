from rest_framework.filters import (
    FilterSet
)
from trialscompendium.trials.models import TrialYield


class TrialYieldListFilter(FilterSet):
    """
    Filter query list from trial yield database
    """
    class Meta:
        model = TrialYield
        fields = {'id': ['exact', 'in'],
                  'plot': ['exact'],
                  'observation': ['iexact', 'icontains'],
                  'year': ['exact', 'in', 'gte', 'lte'],
                  'season': ['iexact', 'icontains'],
                  'trial_yield': ['exact', 'gte', 'lte'],
                  }
        order_by = ['observation', 'season', 'trial_yield']

