/**
 * Parse string number filter
 * Convert string number into valid number
 * Usage: {{value |parseNum}}
 **/

angular
    .module('app.core')
    .filter('parseNum', parseNum);

function parseNum() {
    return parseNumFilter;
    function parseNumFilter(input) {
        return (input && angular.isString(input)) && (parseInt(input) >= 0 || parseInt(input) <= 0) ? input = +input : input;
    }
}
