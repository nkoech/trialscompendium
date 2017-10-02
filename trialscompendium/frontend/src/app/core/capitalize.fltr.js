/**
 * Capitalize Filter
 * Capitalize first character in a sentence use: {{string | capitalize}}
 * Capitalize every first character in a word use: {{string | capitalize:true}}
 **/

angular
    .module('app.core')
    .filter('capitalize', capitalize);

function capitalize() {
    return capitalizeFilter;
    function capitalizeFilter(input, all) {
        var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
        return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
    }
}
