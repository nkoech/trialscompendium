angular
    .module('app.widgets')
    .directive('setActiveLink', setActiveLink);

setActiveLink.$inject = ['$location'];

function setActiveLink($location) {
    return {
        restrict: 'A',
        replace: false,
        link: link
    };

    // Link function should normally be placed outside the directive function.
    // This is an exception since passed arguments i.e. $location are
    // being used inside the link function and we need to make them available.
    function link(scope, elem) {
        //after the route has changed
        scope.$on("$routeChangeSuccess", function () {
            var hrefs = ['/#' + $location.path(),
                '#' + $location.path(), //html5: false
                $location.path()]; //html5: true
            angular.forEach(elem.find('a'), function (a) {
                a = angular.element(a);
                if (hrefs.indexOf(a.attr('href')) !== -1) {
                    a.addClass('active');
                } else {
                    a.removeClass('active');
                }
            });
        });
    }
}





