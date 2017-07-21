from django.conf.urls import url
from .views import (
    trial_yield_views,
    # indicator_views,
    # subpillar_views,
)

# # Subpillar URLs
# urlpatterns = [
#     url(
#         r'^subpillar/$',
#         subpillar_views['SubpillarListAPIView'].as_view(),
#         name='subpillar_list'
#     ),
#     url(
#         r'^subpillar/create/$',
#         subpillar_views['SubpillarCreateAPIView'].as_view(),
#         name='subpillar_create'
#     ),
#     url(
#         r'^subpillar/(?P<slug>[\w-]+)/$',
#         subpillar_views['SubpillarDetailAPIView'].as_view(),
#         name='subpillar_detail'
#     ),
# ]
#
# # Indicator URLs
# urlpatterns += [
#     url(
#         r'^indicator/$',
#         indicator_views['IndicatorListAPIView'].as_view(),
#         name='indicator_list'
#     ),
#     url(
#         r'^indicator/create/$',
#         indicator_views['IndicatorCreateAPIView'].as_view(),
#         name='indicator_create'
#     ),
#     url(
#         r'^indicator/(?P<slug>[\w-]+)/$',
#         indicator_views['IndicatorDetailAPIView'].as_view(),
#         name='indicator_detail'
#     ),
# ]


# Trial yield URLs
urlpatterns = [
    url(
        r'^$',
        trial_yield_views['TrialYieldListAPIView'].as_view(),
        name='trial_yield_list'
    ),
    url(
        r'^create/$',
        trial_yield_views['TrialYieldCreateAPIView'].as_view(),
        name='trial_yield_create'
    ),
    url(
        r'^(?P<pk>[\w-]+)/$',
        trial_yield_views['TrialYieldDetailAPIView'].as_view(),
        name='trial_yield_detail'
    ),
]
