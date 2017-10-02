/**
 * AngularJS default filter with the following expression in ngRepeat:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * propsFilter will instead do the same using OR.
 * Usage: ng-repeat="person in people | propsFilter: {name: $select.search, age: $select.search} track by item.id"
 */

angular
    .module('app.core')
    .filter('propsFilter', propsFilter);

function propsFilter() {
    return filterObjProp;
    function filterObjProp(items, props) {
        var out = [];
        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;
                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }
                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }
        return out;
    }
}
