/**
 * Pick single object based on filter
 * Filter flat objects only - not nested
 * Usage: {{obj | pickSingleObj: filterProperty}}
 * Usage: filterProperty is an array of properties
 **/

angular
    .module('app.core')
    .filter('pickSingleObj', pickSingleObj);

pickSingleObj.$inject = ['valReplaceFilter', 'parseNumFilter'];

function pickSingleObj(valReplaceFilter, parseNumFilter) {
    return pickSingleObjFilter;
    function pickSingleObjFilter(input, filterProp, replaceValue) {
        var outObjArr = [];
        function flattenObj(input, filterProp, replaceValue) {
            if ((!angular.isArray(input) && (input === undefined || input === null)) || (filterProp === undefined || filterProp === null)) {return input;}
            angular.forEach(input, function (value, key) {
                var outObj = {};
                if (value !== undefined || value !== null){
                    if (typeof value === 'object'){
                        flattenObj(value, filterProp, replaceValue);
                    }else{
                        value = valReplaceFilter(value, replaceValue);
                        value = parseNumFilter(value);
                        if (angular.isArray(filterProp) && filterProp.length){
                            angular.forEach(filterProp, function (item) {item === key ? outObj[key] = value : value;});
                        }else if (angular.isArray(filterProp) && !filterProp.length) {
                            outObj[key] = value;
                        }else{
                            filterProp === key ? outObj[key] = value : value;
                        }
                        outObjArr = outObjArr.concat(outObj);
                    }
                }
            });
            // return outObjArr;
        }

        flattenObj(input, filterProp, replaceValue);

        return outObjArr;
    }
}
