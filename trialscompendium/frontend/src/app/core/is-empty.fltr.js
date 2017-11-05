/**
 * Check if object is empty
 * Usage: {{value |isEmpty}}
 **/

angular
    .module('app.core')
    .filter('isEmpty', isEmpty);

function isEmpty() {
    return isEmptyFilter;
    function isEmptyFilter(input) {
        for(var key in input) {
            if(input.hasOwnProperty(key)) return false;
        }
        return true;
    }
}
