from rest_framework.pagination import LimitOffsetPagination


class APILimitOffsetPagination(LimitOffsetPagination):
    """
    Pagination class
    """
    default_limit = 5
    max_limit = 100

    # def paginate_queryset(self, queryset, request, view=None):
    #     model_count = 0
    #     prev_class = None
    #     self.limit = self.get_limit(request)
    #     query_param = request.query_params.get('query', None)
    #     for model in queryset:
    #         model_count += 1
    #         current_class = model.__class__
    #         print(current_class)
    #         if prev_class is None:
    #             prev_class = current_class
    #         if current_class != prev_class:
    #             # self.limit = model_count
    #             print(model_count)
    #             model_count = 0
    #         prev_class = current_class
    #
    #
    #
    #     # self.limit = self.get_limit(request)
    #     if self.limit is None:
    #         return None
    #     self.offset = self.get_offset(request)
    #     self.count = self._get_count(queryset)
    #     self.request = request
    #     if self.count > self.limit and self.template is not None:
    #         self.display_page_controls = True
    #     return list(queryset[self.offset:self.offset + self.limit])
    #
    # def _get_count(self, queryset):
    #     """
    #     Determine an object count, supporting either querysets or regular lists.
    #     """
    #     try:
    #         return queryset.count()
    #     except (AttributeError, TypeError):
    #         return len(queryset)