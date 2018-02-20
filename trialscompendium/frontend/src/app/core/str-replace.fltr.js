/**
 * String replace filter
 * Replace a string from to
 * Usage: {{string | strReplace: from : to}}
 **/

angular
    .module('app.core')
    .filter('strReplace', strReplace);

function strReplace() {
    return strReplaceFilter;
    function strReplaceFilter(input, from, to) {
        if (!input || !from || !to) return;
        return input.replace(new RegExp(from, 'g'), to);
    }
}