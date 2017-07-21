from trialscompendium.utils.pagination import APILimitOffsetPagination
from trialscompendium.utils.keywordsearch import get_query, get_project_models
from trialscompendium.utils.permissions import IsOwnerOrReadOnly
from rest_framework.generics import ListAPIView
from trialscompendium.search.api.globalsearch.globalsearchserializers import global_search_serializers
# from rest_framework.response import Response


def global_search_views():
    """
    Global search views
    :return: All global search views
    :rtype: Object
    """
    global_search_serializer = global_search_serializers()

    class GlobalSearchListAPIView(ListAPIView):
        """
        API list view. Gets all records API.
        """
        serializer_class = global_search_serializer['GlobalSearchListSerializer']
        pagination_class = APILimitOffsetPagination

        def get_queryset(self):
            """
            Return the list of items for this view.
            :return global_results: List of items from global search 
            :rtype: List object as an instance of 'QuerySet'
            """
            query_param = self.request.query_params.get('query', None)
            global_results = []
            model_count = 0
            if query_param:
                for model in get_project_models('trialscompendium'):
                    entry_query = get_query(query_param, model)
                    if entry_query:
                        query_result = model.objects.filter(entry_query).distinct()
                        if query_result.exists():
                            global_results += query_result
                            if model_count == 1:
                                global_results = []
                                break
                            model_count += 1
                if global_results:
                    global_results.sort(key=lambda x: x.time_created)
                    return global_results
            return global_results

        def get_serializer_class(self):
            """
            Return the class to use for the serializer.
            :return: Serializer class
            :rtype: Object
            """
            obj = self.get_queryset()
            if obj:
                for model in obj:
                    self.serializer_class.Meta.model = model.__class__
                    return self.serializer_class
            return self.serializer_class

        # def get_serializer(self, *args, **kwargs):
        #     serializer_class = self.get_serializer_class()
        #     kwargs['context'] = self.request
        #     serialize_data = False
        #     for model in args[0]:
        #         serialize_data = True if serializer_class.Meta.model == model.__class__ else False
        #     if serialize_data:
        #         return serializer_class(*args, **kwargs)
        #     return Response(None)
    return {
        'GlobalSearchListAPIView': GlobalSearchListAPIView
    }
