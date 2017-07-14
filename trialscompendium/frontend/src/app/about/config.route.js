angular
    .module('app.about')
    .config(routes);

routes.$inject = ["$routeProvider", "$locationProvider"];

function routes($routeProvider, $locationProvider) {
    $routeProvider.
        when('/about', {
            title: 'about',
            controller: 'AboutController',
            controllerAs: 'vm',
            templateUrl: require("./about.tpl.html")
        });
    $locationProvider.html5Mode(true);
}