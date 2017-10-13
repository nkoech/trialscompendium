/**
 * Pick object based on filter
 * Filter flat objects - not nested
 * Usage: {{obj | pickObj: filterProperty}}
 * Usage: filterProperty is an array of properties
 **/

angular
    .module('app.core')
    .filter('pickObj', pickObj);

function pickObj() {
    var pickedTrials = [];
    return pickObjFilter;
    function pickObjFilter(input, filterProp) {
        angular.forEach(input, function (value, key) {
            var obj = {};
            if (value !== undefined && value !== null){
                if (typeof value === 'object'){
                    pickObjFilter(value, filterProp);
                }else{
                    angular.forEach(filterProp, function (prop) {
                        if (prop === key) {
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
