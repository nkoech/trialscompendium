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
    // return pickMultiObjFilter;
    // function pickMultiObjFilter(input, filterProp, replaceValue) {
    //     if ((!angular.isArray(input) && (input === undefined || input === null)) || (filterProp === undefined || filterProp === null)) {return input;}
    //     // var outObjArr = input.map(function (obj) {
    //     //     var outObj = {};
    //     //     angular.forEach(filterProp, function (key) {
    //     //         if (obj.hasOwnProperty(key)){
    //     //             var value = valReplaceFilter(obj[key], replaceValue);
    //     //             outObj[key] = parseNumFilter(value);
    //     //         }
    //     //     });
    //     //     return outObj;
    //     // });
    //     // return outObjArr;
    //
    //     return input.map(function(obj){
    //         return Object.keys(obj).filter(function(key){
    //             return filterProp.includes(key);
    //         }).reduce(function(newObj, key){
    //             var value = valReplaceFilter(obj[key], replaceValue);
    //             newObj[key] = parseNumFilter(value);
    //             return newObj;
    //         }, {});
    //     });
    // }

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

