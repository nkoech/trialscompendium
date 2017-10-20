angular
    .module('app.core')
    .constant('BASE_URL', 'http://127.0.0.1:8000/api')
    .factory('trialService', trialService);

trialService.$inject = ['$resource', 'BASE_URL', '$log', 'strReplaceFilter'];

function trialService($resource, BASE_URL, $log, strReplaceFilter) {
    var initTableData = [];
    return {
        'search': search,
        'get': get,
        'searchAllPages': searchAllPages,
        'getTrials': getTrials
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
        // Search one or more records per page
        return makeRequest(apiNode + '/', query).query().$promise.
        then(function(data){
            return data;
        });
    }

    function get(apiNode, query) {
        // Get one record per page
        var id = Object.keys(query)[0];
        return makeRequest(apiNode + '/:' + id, query).get().$promise;
    }

    function searchAllPages(apiNode, query, list) {
        // Search one or more records in all pages
        return makeRequest(apiNode + '/', query).query().$promise.then(function(data){
            list = list.concat(data.results);
            if (data.next) {
                query.offset += query.limit;
                return searchAllPages(apiNode, query, list);
            }
            return list;
        });
    }

    function getNestedTrials(data){
        var newKey = '';
        var outObjArr = [];
        var innerObj = false;
        angular.forEach(data, function(obj) {
            var outObj = {};
            angular.forEach(obj, function (value, key) {
                if (typeof value === 'object') {
                    innerObj = value;
                } else {
                    if (value === 'Short Rains' || value === 'Long Rains') {
                        newKey = strReplaceFilter(value, ' ', '_').toLowerCase()
                    }else if(key === 'trial_yield') {
                        key = newKey;
                    }
                    outObj[key] = value;
                }
            });
            outObjArr = outObjArr.concat(outObj);
        });
        return {
            outObjArr: outObjArr,
            innerObj: innerObj
        };
    }

    function filterObj(data, filterProp) {
        var outObjArr = [];
        angular.forEach(data, function(obj){
            var outObj = {};
            angular.forEach(obj, function (value, key) {
                angular.forEach(filterProp, function (item) {
                    if (item === key) {
                        // Replace true and false js values with Plus and Minus string respectively
                        value = (value === true) ? 'Plus' : (value === false) ? 'Minus' : value;
                        outObj[key] = value;
                    }
                });
            });
            outObjArr = outObjArr.concat(outObj);
        });
        return outObjArr;
    }

    function mergeObj(data, mergeProp){
        // Merge similar objects into one
        var outObjArr = [];
        angular.forEach(data, function(obj){
            var existing = outObjArr.filter(function(item) {
                return item[mergeProp] == obj[mergeProp];
            });
            if (existing.length) {
                var existingIndex = outObjArr.indexOf(existing[0]);
                angular.merge(outObjArr[existingIndex], obj);
            } else {
                outObjArr = outObjArr.concat(obj);
            }
        });
        return outObjArr;
    }

    function getTrials(data, filterProp) {
        angular.forEach(data, function (obj) {
            var objLevel, firstLevelData, secondLevelData,  thirdLevelData = '';
            angular.forEach(obj, function(value){
                if (value !== undefined && value !== null && typeof value === 'object'){
                    objLevel = getNestedTrials(value);
                    secondLevelData = filterObj(objLevel.outObjArr, filterProp);
                    if (objLevel.innerObj){
                        objLevel = getNestedTrials(objLevel.innerObj);
                        thirdLevelData = filterObj(objLevel.outObjArr, filterProp);
                        thirdLevelData = mergeObj(thirdLevelData, 'observation');
                    }
                }else{
                    // Get API first level objects
                    firstLevelData = filterObj([obj], filterProp);
                }
            });

            angular.forEach(thirdLevelData, function(thirdObj){
                angular.forEach(secondLevelData, function(secondObj){
                    angular.forEach(firstLevelData, function(firstObj){
                        initTableData = initTableData.concat(angular.merge({}, firstObj, secondObj, thirdObj));
                    });
                });
            });
        });
        return initTableData;
    }

    function dataServiceError(errorResponse) {
        $log.error('XHR Failed for ShowService');
        $log.error(errorResponse);
        return errorResponse;
    }
}
