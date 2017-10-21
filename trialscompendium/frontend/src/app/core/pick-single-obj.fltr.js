/**
 * Pick single object based on filter
 * Filter flat objects only - not nested
 * Usage: {{obj | pickSingleObj: filterProperty}}
 * Usage: filterProperty is an array of properties
 **/

angular
    .module('app.core')
    .filter('pickSingleObj', pickSingleObj);

function pickSingleObj() {
    var pickedTrials = [];
    return pickSingleObjFilter;
    function pickSingleObjFilter(input, filterProp) {
        angular.forEach(input, function (value, key) {
            var obj = {};
            if (value !== undefined || value !== null){
                if (typeof value === 'object'){
                    pickSingleObjFilter(value, filterProp);
                }else{
                    angular.forEach(filterProp, function (item) {
                        if (item === key) {
                            // Replace true and false js values with Plus and Minus string respectively
                            value = (value === true) ? 'Plus' : (value === false) ? 'Minus' : value;
                            obj[key] = value;
                            pickedTrials = pickedTrials.concat(obj);
                        }
                    });
                }
            }
        });
        return pickedTrials;
    }
}
