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
        if ((!angular.isArray(input) && (input === undefined || input === null)) || (filterProp === undefined || filterProp === null)) {return input;}
        return input.map(function(obj){
            return Object.keys(obj).filter(function(key){
                return filterProp.includes(key);
            }).reduce(function(newObj, key){
                var value = valReplaceFilter(obj[key], replaceValue);
                newObj[key] = parseNumFilter(value);
                return newObj;
            }, {});
        });
    }
}

