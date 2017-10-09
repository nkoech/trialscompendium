/**
 * Boolean filter
 * Replace boolean from to
 * Usage: {{value | boolReplace: ['Plus','Minus']}}
 **/

angular
    .module('app.core')
    .filter('boolReplace', boolReplace);

function boolReplace() {
    return boolReplaceFilter;
    function boolReplaceFilter(input, strList) {
        return (input === true) ? strList[0] : (input === false) ? strList[1] : input;
    }
}