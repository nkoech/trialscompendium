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
        fields = {'id': ['exact', 'in'],
                  'no_replicate': ['exact', 'in', 'gte', 'lte'],
                  'nitrogen_treatment': ['iexact', 'in', 'icontains'],
                  'phosphate_treatment': ['iexact', 'in', 'icontains'],
                  'tillage_practice': ['iexact', 'in', 'icontains'],
                  'cropping_system': ['iexact', 'in', 'icontains'],
                  'crops_grown': ['iexact', 'in', 'icontains'],
                  'farm_yard_manure': ['iexact', 'in', 'icontains'],
                  'farm_residue': ['iexact', 'in', 'icontains'],
                  }
        order_by = ['tillage_practice', 'cropping_system', 'crops_grown']
