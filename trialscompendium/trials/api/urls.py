from django.conf.urls import url
from .views import (
    plot_views,
    trial_yield_views,
    treatment_views,
)

# Treatment URLs
urlpatterns = [
    url(
        r'^treatment/$',
        treatment_views['TreatmentListAPIView'].as_view(),
        name='treatment_list'
    ),
    url(
        r'^treatment/create/$',
        treatment_views['TreatmentCreateAPIView'].as_view(),
        name='treatment_create'
    ),
    url(
        r'^treatment/(?P<pk>[\w-]+)/$',
        treatment_views['TreatmentDetailAPIView'].as_view(),
        name='treatment_detail'
    ),
]

# Trial Yield URLs
urlpatterns += [
    url(
        r'^yield/$',
        trial_yield_views['TrialYieldListAPIView'].as_view(),
        name='trial_yield_list'
    ),
    url(
        r'^yield/create/$',
        trial_yield_views['TrialYieldCreateAPIView'].as_view(),
        name='trial_yield_create'
    ),
    url(
        r'^yield/(?P<pk>[\w-]+)/$',
        trial_yield_views['TrialYieldDetailAPIView'].as_view(),
        name='trial_yield_detail'
    ),
]


# Plot URLs
urlpatterns += [
    url(
        r'^$',
        plot_views['PlotListAPIView'].as_view(),
        name='plot_list'
    ),
    url(
        r'^create/$',
        plot_views['PlotCreateAPIView'].as_view(),
        name='plot_create'
    ),
    url(
        r'^(?P<slug>[\w-]+)/$',
        plot_views['PlotDetailAPIView'].as_view(),
        name='plot_detail'
    ),
]
