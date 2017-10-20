/**
 * Value replace filter
 * Replace a specific input value with object key  
 * Usage: {{string | {key: value}}}
 **/

angular
    .module('app.core')
    .filter('valReplace', valReplace);

function valReplace() {
    return valReplaceFilter;
    function valReplaceFilter(input, obj) {
        if (obj && typeof obj === 'object'){
            angular.forEach(obj, function (v, k) {
                input = input === v ? k : input;
            });
        }
        return input;
    }
}




