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
        angular.forEach(input, function (obj) {
            angular.forEach(obj, function (value) {
                if (uniqueItems.indexOf(value) === -1){
                    uniqueItems.push(value);
                    uniqueObj.push(obj);
                }
            });
        });
        return uniqueObj;
    }
}