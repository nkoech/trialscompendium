angular
    .module('app.core')
    .factory('searchParamService', searchParamService);

searchParamService.$inject = ['trialService', 'isEmptyFilter', 'valReplaceFilter'];

function searchParamService(trialService, isEmptyFilter, valReplaceFilter) {
    return {
        'setSearchParam': setSearchParam
    };

    // function setApiFilter (baseURLObj, apiNode, filterField, filterLookup, value){
    //     if (!isEmptyFilter(baseURLObj) && Object.keys(baseURLObj).indexOf(apiNode) != -1){
    //         baseURLObj[apiNode] += '&' + filterField + filterLookup + value;
    //     }else{
    //         baseURLObj[apiNode] = apiNode + '?' + filterField + filterLookup + value;
    //     }
    // }
    //
    // function setMultiSelectApiFilter (baseURLFilter, lookUps, replaceChar){
    //     angular.forEach(lookUps, function(lkValue, lkKey){
    //         var apiURL = '', selKey = '', val = '';
    //         angular.forEach(lkValue, function(arrObj){
    //             angular.forEach(arrObj, function(value, key){
    //                 if (lkKey === key){
    //                     selKey = key;
    //                     if (arrObj[key].toString().endsWith(replaceChar)){
    //                         apiURL = arrObj[key];
    //                     } else {
    //                         val = arrObj[key];
    //                     }
    //                 }
    //             });
    //             if (apiURL && selKey && val) {
    //                 setApiFilter(baseURLFilter, apiURL, selKey, '__in=', val);
    //             }
    //         });
    //     });
    // }
    //
    // function newFilterObject (newObjVal, selKey, objVal, newApiURL, apiURL, objKey) {
    //     var newVal = !newObjVal[selKey] ? newObjVal[selKey] = objVal : newObjVal[selKey] += ',' + objVal;
    //     var newURL = !newApiURL[selKey] ? apiURL : newApiURL[selKey];
    //     var key = !objKey ? selKey : objKey;
    //     return {
    //         'newVal': newVal,
    //         'newURL': newURL,
    //         'key': key
    //     }
    // }
    //
    // function getSearchUrl (baseURLs, userOption, replaceFilterVal){
    //     var baseURLFilter = {};
    //     var inLookUps = {};
    //     var selectedCopy = angular.copy(userOption);
    //     selectedCopy = trialService.removeProperty(selectedCopy, 'All');
    //     angular.forEach(baseURLs, function(apiURL, fieldId){
    //         angular.forEach(selectedCopy, function(selValue, selKey){
    //             if (angular.isArray(selValue)){
    //                 var objKey = '', newObjVal = {}, newApiURL = {};
    //                 angular.forEach(selValue, function(selArray){
    //                     if (fieldId === selKey) {
    //                         var objVal = selArray[selKey];
    //                         var filterObj;
    //                         if (angular.isString(objVal)){
    //                             selArray[selKey] = valReplaceFilter(objVal, replaceFilterVal);
    //                             if (selArray[selKey]===true || selArray[selKey]===false){
    //                                 var bolVal = selArray[selKey];
    //                                 filterObj = newFilterObject(newObjVal, selKey, bolVal, newApiURL, apiURL, objKey);
    //                                 newObjVal[selKey] = filterObj.newVal; newApiURL[selKey] = filterObj.newURL; objKey = filterObj.key;
    //                             }else{
    //                                 setApiFilter(baseURLFilter, apiURL, selKey, '__iexact=', selArray[selKey]);
    //                             }
    //                         }else if ( !isNaN(objVal) && angular.isNumber(+objVal)) {
    //                             filterObj = newFilterObject(newObjVal, selKey, objVal, newApiURL, apiURL, objKey);
    //                             newObjVal[selKey] = filterObj.newVal; newApiURL[selKey] = filterObj.newURL; objKey = filterObj.key;
    //                         }
    //                     }
    //                 });
    //                 if (objKey && Object.keys(newObjVal).length != 0 && Object.keys(newApiURL).length != 0){
    //                     inLookUps[objKey] = [newObjVal, newApiURL];
    //                 }
    //             }else{
    //                 if (fieldId === selKey) {
    //                     if (angular.isString(selValue[selKey])){
    //                         setApiFilter(baseURLFilter, apiURL, selKey, '__iexact=', selValue[selKey]);
    //                     }else if ( !isNaN(selValue[selKey]) && angular.isNumber(+selValue[selKey])) {
    //                         setApiFilter(baseURLFilter, apiURL, selKey, '=', selValue[selKey]);
    //                     }
    //                 }
    //             }
    //         });
    //     });
    //     setMultiSelectApiFilter(baseURLFilter, inLookUps, '/');
    //     return baseURLFilter;
    // }

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
        selectedCopy = trialService.removeProperty(selectedCopy, 'All');
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
