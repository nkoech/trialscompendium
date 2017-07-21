from rest_framework.filters import (
    FilterSet
)
from trialscompendium.trials.models import Treatment


class TreatmentListFilter(FilterSet):
    """
    Filter query list from treatment database table
    """
    class Meta:
        model = Treatment
        fields = {'no_replicate': ['exact', 'gte', 'lte'],
                  'nitrogen_treatment': ['iexact', 'icontains'],
                  'phosphate_treatment': ['iexact', 'icontains'],
                  'tillage_practice': ['iexact', 'icontains'],
                  'cropping_system': ['iexact', 'icontains'],
                  'crops_grown': ['iexact', 'icontains'],
                  'farm_yard_manure': ['iexact', 'icontains'],
                  'farm_residue': ['iexact', 'icontains'],
                  }
        order_by = ['tillage_practice', 'cropping_system', 'crops_grown']
