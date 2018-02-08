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
                  'plot': ['exact', 'in'],
                  'observation': ['iexact', 'in', 'icontains'],
                  'year': ['exact', 'in', 'gte', 'lte'],
                  'season': ['iexact', 'in', 'icontains'],
                  'trial_yield': ['exact', 'in', 'gte', 'lte'],
                  }
        order_by = ['observation', 'season', 'trial_yield']

