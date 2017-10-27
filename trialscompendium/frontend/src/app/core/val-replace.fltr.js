/**
 * Value replace filter
 * Replace a specific input value with object key
 * Object settings i.e. {key: value}:
 *      value: The value to be replaced in the input
 *      key: The value to replace the input
 * Usage: {{value |valReplace: {key: value}}}
 **/

angular
    .module('app.core')
    .filter('valReplace', valReplace);

function valReplace() {
    return valReplaceFilter;
    function valReplaceFilter(input, obj) {
        if (obj && typeof obj === 'object'){
            angular.forEach(obj, function (v, k) {
                if(eval('typeof '+ k) !== "undefined"){
                    input = input === v ? eval(k) : input;
                }else {
                    input = input === v ? k : input;
                }
            });
        }
        return input;
    }
}




