# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from trialscompendium.utils.abstractmodels import (
    AuthUserDetail,
    CreateUpdateTime,
)
from trialscompendium.utils.createslug import create_slug
from trialscompendium.utils.modelmanagers import (
    model_instance_filter,
    model_foreign_key_qs,
    model_type_filter,
    create_model_type,
)
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
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

    TILLAGE_PRACTICE = (
        ('Conservation', 'Conservation'),
        ('Conventional', 'Conventional'),
        ('Reduced', 'Reduced'),
        ('Intensive', 'Intensive'),
    )

    CROPPING_SYSTEM = (
        ('Continuous', 'Continuous'),
        ('Intercropping', 'Intercropping'),
        ('Rotation', 'Rotation'),
    )

    slug = models.SlugField(max_length=50, unique=True, blank=True)
    no_replicate = models.PositiveSmallIntegerField(verbose_name='Number of replication')
    nitrogen_treatment = models.DecimalField(max_length=4, choices=NITROGEN_TREATMENT, default=NITROGEN_TREATMENT[0][0])
    phosphate_treatment = models.CharField(max_length=4, choices=PHOSPHATE_TREATMENT, default=PHOSPHATE_TREATMENT[0][0])
    tillage_practice = models.CharField(max_length=30, choices=TILLAGE_PRACTICE, default=TILLAGE_PRACTICE[0][0])
    cropping_system = models.CharField(max_length=30, choices=CROPPING_SYSTEM, default=CROPPING_SYSTEM[0][0])
    crops_grown = models.CharField(max_length=60)
    farm_yard_manure = models.BooleanField(default=True)
    farm_residue = models.BooleanField(default=True)

    def __unicode__(self):
        str_format = '{0}: {1}{2}'.format(self.crops_grown, self.nitrogen_treatment, self.phosphate_treatment)
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
        ordering = ['-time_created', '-last_update']
        verbose_name_plural = 'Subpillars'

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