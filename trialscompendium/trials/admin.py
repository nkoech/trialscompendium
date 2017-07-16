from django.contrib import admin

# Register your models here.
from .models import (Treatment, Plot, TrialYield,)


class TreatmentModelAdmin(admin.ModelAdmin):
    """
    Treatment model admin settings
    """
    list_display = [
        'tillage_practice', 'cropping_system', 'crops_grown', 'nitrogen_treatment',
        'phosphate_treatment', 'no_replicate', 'farm_yard_manure', 'farm_residue', 'last_update', 'modified_by'
    ]
    list_display_links = ['cropping_system', 'nitrogen_treatment', 'phosphate_treatment']
    list_filter = [
        'tillage_practice', 'cropping_system', 'crops_grown',
        'nitrogen_treatment', 'phosphate_treatment', 'last_update', 'modified_by'
    ]

    class Meta:
        model = Treatment


class PlotModelAdmin(admin.ModelAdmin):
    """
    Plot model admin settings
    """
    list_display = ['trial_id', 'plot_id', 'sub_plot_id', 'treatment', 'last_update', 'modified_by']
    list_display_links = ['plot_id', 'treatment']
    list_filter = ['plot_id', 'treatment', 'last_update', 'modified_by']

    class Meta:
        model = Plot


class TrialYieldModelAdmin(admin.ModelAdmin):
    """
    Trial yield model admin settings
    """
    list_display = ['plot', 'observation', 'year', 'season', 'trial_yield', 'last_update', 'modified_by']
    list_display_links = ['observation', 'year']
    list_filter = ['observation', 'plot', 'year', 'last_update', 'modified_by']

    class Meta:
        model = TrialYield


admin.site.register(Treatment, TreatmentModelAdmin)
admin.site.register(Plot, PlotModelAdmin)
admin.site.register(TrialYield, TrialYieldModelAdmin)
