angular
    .module('app.core')
    .constant('BASE_URL', 'http://127.0.0.1:8000/api')
    .factory('trialService', trialService);

trialService.$inject = ['$resource', 'BASE_URL', '$log', 'strReplaceFilter', 'valReplaceFilter'];

function trialService($resource, BASE_URL, $log, strReplaceFilter, valReplaceFilter) {
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

    function strToKey(keyOptions, str) {
        // Convert string to key by replacing space with an underscore
        if (keyOptions) {
            var newKey = false;
            str = typeof str !== undefined || str !== null ? str : false;
            angular.forEach(keyOptions, function(opt){
                if (str === opt){
                    newKey = strReplaceFilter(str, ' ', '_').toLowerCase();
                }
            });
            return newKey;
        }
    }

    function getNestedTrials(data, replaceKey, keyOptions){
        var newKey = '';
        var outObjArr = [];
        var nestedObj = false;
        replaceKey = typeof replaceKey !== undefined || replaceKey !== null ? replaceKey : false;
        keyOptions = typeof keyOptions !== undefined || keyOptions !== null ? keyOptions : false;
        angular.forEach(data, function(obj) {
            var outObj = {};
            angular.forEach(obj, function (value, key) {
                if (typeof value === 'object') {
                    nestedObj = value;
                } else {
                    newKey = strToKey(keyOptions, value) ? strToKey(keyOptions, value) : newKey;
                    key = key === replaceKey ? newKey : key;
                    outObj[key] = value;
                }
            });
            outObjArr = outObjArr.concat(outObj);
        });
        return {
            outObjArr: outObjArr,
            nestedObj: nestedObj
        };
    }

    function pickMultiObj(data, filterProp, valueOptions) {
        var outObjArr = [];
        valueOptions = typeof valueOptions !== undefined || valueOptions !== null ? valueOptions : false;
        if ((!angular.isArray(data) && (data === undefined || data === null)) || (filterProp === undefined || filterProp === null)) {return data;}
        angular.forEach(data, function(obj){
            var outObj = {};
            angular.forEach(obj, function (value, key) {
                value = valReplaceFilter(value, valueOptions);
                if (angular.isArray(filterProp) && filterProp.length){
                    angular.forEach(filterProp, function (item) {item === key ? outObj[key] = value : value;});
                }else{
                    filterProp === key ? outObj[key] = value : value;
                }
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
                    secondLevelData = pickMultiObj(objLevel.outObjArr, filterProp);
                    if (objLevel.nestedObj){
                        objLevel = getNestedTrials(objLevel.nestedObj, 'trial_yield', ['Short Rains', 'Long Rains']);
                        thirdLevelData = pickMultiObj(objLevel.outObjArr, filterProp);
                        thirdLevelData = mergeObj(thirdLevelData, 'observation');
                    }
                }else{
                    // Get API first level objects
                    firstLevelData = pickMultiObj([obj], filterProp, {Plus: true, Minus: false});
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
