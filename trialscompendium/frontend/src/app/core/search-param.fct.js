angular
    .module('app.core')
    .factory('searchParamService', searchParamService);

searchParamService.$inject = ['trialService', 'valReplaceFilter'];

function searchParamService(trialService, valReplaceFilter) {
    return {
        'setSearchParam': setSearchParam
    };
    function createParamObj (searchParam, apiURL, selKey, obj){
        var lookup = selKey + '__in';
        if (Object.keys(searchParam).length === 0 || !(apiURL in searchParam)) {
            searchParam[apiURL] = {};
            searchParam[apiURL][lookup] = obj[selKey];
        } else {
            if (lookup in searchParam[apiURL]){
                searchParam[apiURL][lookup] += ',' + obj[selKey];
            } else {
                searchParam[apiURL][lookup] = obj[selKey];
            }
        }
    }

    function setSearchParam (baseURLs, userOption, replaceFilterVal){
        var searchParam = {};
        var selectedCopy = angular.copy(userOption);
        selectedCopy = trialService.removePropertyValue(selectedCopy, 'All');
        angular.forEach(baseURLs, function(apiURL, fieldId){
            angular.forEach(selectedCopy, function(selValue, selKey){
                if (angular.isArray(selValue)){
                    angular.forEach(selValue, function(arrObj){
                        if (fieldId === selKey) {
                            arrObj[selKey] = valReplaceFilter(arrObj[selKey], replaceFilterVal);
                            createParamObj(searchParam, apiURL, selKey, arrObj);
                        }
                    });
                }else{
                    if (fieldId === selKey) {
                        createParamObj(searchParam, apiURL, selKey, selValue);
                    }
                }
            });
        });
        return searchParam;
    }
}
