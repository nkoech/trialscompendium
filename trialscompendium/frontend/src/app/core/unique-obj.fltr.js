/**
 * Unique trials filter
 * Filter flat objects - not nested
 * Usage: {{obj | uniqueObj}}
 **/

angular
    .module('app.core')
    .filter('uniqueObj', uniqueObj);

function uniqueObj() {
    return uniqueObjFilter;
    function uniqueObjFilter(input) {
        var uniqueObj = [];
        var uniqueItems = [];
        var keyValue = '';
        angular.forEach(input, function (obj) {
            angular.forEach(obj, function (value, key) {
                keyValue = value + key;
                if (uniqueItems.indexOf(keyValue) == -1){
                    uniqueItems.push(keyValue);
                    uniqueObj.push(obj);
                }
            });
        });
        return uniqueObj;
    }
}