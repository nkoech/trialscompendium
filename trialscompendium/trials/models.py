# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from trialscompendium.utils.abstractmodels import (
    AuthUserDetail,
    CreateUpdateTime,
)
from trialscompendium.utils.createslug import create_slug
from trialscompendium.utils.modelmanagers import (
    model_foreign_key_qs,
    model_type_filter,
    get_year_choices,
    get_datetime_now,
)
from django.db import models
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.core.urlresolvers import reverse


class Treatment(AuthUserDetail, CreateUpdateTime):

    """
    Treatment model
    """
    NITROGEN_TREATMENT = (
        ('N0', 'N0'),
        ('N30', 'N30'),
        ('N60', 'N60'),
        ('N90', 'N90'),
    )

    PHOSPHATE_TREATMENT = (
        ('P0', 'P0'),
        ('P60', 'P60'),
    )

    TILLAGE_PRACTICES = (
        ('Conservation', 'Conservation'),
        ('Conventional', 'Conventional'),
        ('Reduced', 'Reduced'),
        ('Intensive', 'Intensive'),
    )

    CROPPING_SYSTEMS = (
        ('Continuous', 'Continuous'),
        ('Intercropping', 'Intercropping'),
        ('Rotation', 'Rotation'),
    )

    no_replicate = models.PositiveSmallIntegerField(verbose_name='Number of replication')
    nitrogen_treatment = models.CharField(max_length=4, choices=NITROGEN_TREATMENT, default=NITROGEN_TREATMENT[0][0])
    phosphate_treatment = models.CharField(max_length=4, choices=PHOSPHATE_TREATMENT, default=PHOSPHATE_TREATMENT[0][0])
    tillage_practice = models.CharField(max_length=30, choices=TILLAGE_PRACTICES, blank=True, null=True)
    cropping_system = models.CharField(max_length=30, choices=CROPPING_SYSTEMS, blank=True, null=True)
    crops_grown = models.CharField(max_length=60)
    farm_yard_manure = models.BooleanField(default=True)
    farm_residue = models.BooleanField(default=True)

    def __unicode__(self):
        str_format = 'TP: {0}, CS: {1}, Crops: {2}, Nitrogen-Phosphate: {3}{4}, Rep: {5}, FYM: {6}, Residue: {7}'.format(
            self.tillage_practice, self.cropping_system, self.crops_grown, self.nitrogen_treatment,
            self.phosphate_treatment, self.no_replicate, self.farm_yard_manure, self.farm_residue
        )
        return str_format

    def __str__(self):
        str_format = '{0}: {1}{2}'.format(self.crops_grown, self.nitrogen_treatment, self.phosphate_treatment)
        return str_format

    def get_api_url(self):
        """
        Get treatment URL as a reverse from model
        :return: URL
        :rtype: String
        """
        return reverse('trials_api:treatment_detail', kwargs={'pk': self.pk})

    class Meta:
        unique_together = [
            'no_replicate', 'nitrogen_treatment', 'phosphate_treatment', 'tillage_practice',
            'cropping_system', 'crops_grown', 'farm_yard_manure', 'farm_residue'
        ]
        ordering = ['-time_created', '-last_update']
        verbose_name_plural = 'Treatments'

    @property
    def plot_relation(self):
        """
        Get related plot properties
        :return: Query result from the plot model
        :rtype: object/record
        """
        instance = self
        qs = Plot.objects.filter_by_model_type(instance)
        return qs


class PlotManager(models.Manager):
    """
    Plot model manager
    """
    def filter_by_model_type(self, instance):
        """
        Query related objects/model type
        :param instance: Object instance
        :return: Matching object else none
        :rtype: Object/record
        """
        obj_qs = model_foreign_key_qs(instance, self, PlotManager)
        if obj_qs.exists():
            return model_type_filter(self, obj_qs, PlotManager)


class Plot(AuthUserDetail, CreateUpdateTime):
    """
    Plot model. Creates plot entity.
    """
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    trial_id = models.CharField(max_length=20, blank=True, null=True)
    plot_id = models.CharField(max_length=20, unique=True)
    sub_plot_id = models.CharField(max_length=15, blank=True, null=True)
    treatment = models.ForeignKey(Treatment, on_delete=models.PROTECT)
    objects = PlotManager()

    def __unicode__(self):
        return self.plot_id

    def __str__(self):
        return self.plot_id

    def get_api_url(self):
        """
        Get plot URL as a reverse from model
        :return: URL
        :rtype: String
        """
        return reverse('trials_api:plot_detail', kwargs={'slug': self.slug})

    class Meta:
        ordering = ['-time_created', '-last_update']
        verbose_name_plural = 'Plots'

    @property
    def trial_yield_relation(self):
        """
        Get related trial yield
        :return: Query result from the trial yield model
        :rtype: object/record
        """
        instance = self
        qs = TrialYield.objects.filter_by_model_type(instance)
        return qs


@receiver(pre_save, sender=Plot)
def pre_save_plot_receiver(sender, instance, *args, **kwargs):
    """
    Create a slug before save.
    :param sender: Signal sending object
    :param instance: Object instance
    :param args: Any other argument
    :param kwargs: Keyword arguments
    :return: None
    :rtype: None
    """
    if not instance.slug:
        instance.slug = create_slug(instance, Plot, instance.plot_id)


class TrialYieldManager(models.Manager):
    """
    Trial yield model manager
    """
    def filter_by_model_type(self, instance):
        """
        Query related objects/model type
        :param instance: Object instance
        :return: Matching object else none
        :rtype: Object/record
        """
        obj_qs = model_foreign_key_qs(instance, self, TrialYieldManager)
        if obj_qs.exists():
            return model_type_filter(self, obj_qs, TrialYieldManager)


class TrialYield(AuthUserDetail, CreateUpdateTime):
    """
    Trial yield model. Creates trial yield entity
    """
    SEASONS = (
        ('Short Rains', 'Short Rains'),
        ('Long Rains', 'Long Rains'),
    )

    plot = models.ForeignKey(Plot, on_delete=models.PROTECT)
    observation = models.CharField(max_length=45)
    year = models.SmallIntegerField(choices=get_year_choices(), default=get_datetime_now())
    season = models.CharField(max_length=11, choices=SEASONS)
    trial_yield = models.DecimalField(max_digits=6, decimal_places=2)
    objects = TrialYieldManager()

    def __unicode__(self):
        str_format = '{0}, {1}, {2}, {3}'.format(self.observation, self.year, self.season, self.trial_yield)
        return str(str_format)

    def __str__(self):
        str_format = '{0}, {1}, {2}, {3}'.format(self.observation, self.year, self.season, self.trial_yield)
        return str(str_format)

    def get_api_url(self):
        """
        Get trial yield URL as a reverse from model
        :return: URL
        :rtype: String
        """
        return reverse('trials_api:trial_yield_detail', kwargs={'pk': self.pk})

    class Meta:
        ordering = ['-time_created', '-last_update']
        verbose_name_plural = 'Trial Yields'
