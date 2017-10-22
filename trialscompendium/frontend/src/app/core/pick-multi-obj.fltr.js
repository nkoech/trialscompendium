/**
 * Pick an object with multiple properties
 * Filter flat objects - not nested
 * Usage: {{obj | pickMultiObj: filterProperty : {key: value} <optional>}}
 * Usage: filterProperty is an array of properties
 **/

angular
    .module('app.core')
    .filter('pickMultiObj', pickMultiObj);

pickMultiObj.$inject = ['valReplaceFilter', 'parseNumFilter'];

function pickMultiObj(valReplaceFilter, parseNumFilter) {
    return pickMultiObjFilter;
    function pickMultiObjFilter(input, filterProp, replaceValue) {
        var outObjArr = [];
        if ((!angular.isArray(input) && (input === undefined || input === null)) || (filterProp === undefined || filterProp === null)) {return input;}
        angular.forEach(input, function(obj){
            var outObj = {};
            angular.forEach(obj, function (value, key) {
                value = valReplaceFilter(value, replaceValue);
                value = parseNumFilter(value);
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
}

