angular
    .module('app.core')
    .constant('BASE_URL', 'http://127.0.0.1:8000/api')
    .factory('researchService', researchService);

researchService.$inject = ['$resource', 'BASE_URL', '$log'];

function researchService($resource, BASE_URL, $log) {
    return {
        'search': search,
        'get': get
    };

    function makeRequest(url, params) {
        var requestUrl = BASE_URL + '/' + url;

        return $resource(requestUrl, {}, {
            query: {
                'method': 'GET',
                'params': params,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'interceptor' : {
                    'responseError' : dataServiceError
                },
                'cache': true
            },
            get: {
                'method': 'GET',
                'params': params,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'interceptor' : {
                    'responseError' : dataServiceError
                },
                'cache': true
            }
        });
    }

    function search(apiNode, query){
        // Query can be passed empty i.e. {}
        return makeRequest(apiNode + '/', query).query().$promise.
        then(function(data){
            return data.results;
        });
    }

    function get(apiNode, query) {
        var id = Object.keys(query)[0];
        return makeRequest(apiNode + '/:' + id, query).get().$promise;
    }

    function dataServiceError(errorResponse) {
        $log.error('XHR Failed for ShowService');
        $log.error(errorResponse);
        return errorResponse;
    }
}

// researchService.$inject = ['$http', 'BASE_URL', '$log'];
//
// function researchService($http, BASE_URL, $log) {
//     return {
//         'getListData': getListData,
//         'getDetailData': getDetailData,
//         'search': search
//     };
//
//     function makeRequest(url, params) {
//         var requestUrl = BASE_URL + '/' + url;
//         angular.forEach(params, function(value, key){
//             requestUrl = requestUrl + '?' + key + '=' + value;
//         });
//         return $http({
//             'url': requestUrl,
//             'method': 'GET',
//             'headers': {
//                 'Content-Type': 'application/json'
//             },
//             'cache': true
//         }).then(function(response){
//             return response.data;
//         }).catch(dataServiceError);
//     }
//
//     function getListData(apiNode) {
//         return makeRequest(apiNode + '/', {});
//     }
//
//     function getDetailData(apiNode, id) {
//         return makeRequest(apiNode + '/' + id, {});
//     }
//
//     function search(query){
//         return makeRequest('search/', {query: query}).then(function(data){
//             return data.results;
//         });
//     }
//
//     function dataServiceError(errorResponse) {
//         $log.error('XHR Failed for ShowService');
//         $log.error(errorResponse);
//         return errorResponse;
//     }
// }

