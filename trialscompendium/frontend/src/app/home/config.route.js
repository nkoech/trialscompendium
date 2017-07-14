angular
    .module('app.home')
    .config(routes);

routes.$inject = ["$routeProvider", "$locationProvider"];

function routes($routeProvider, $locationProvider) {
    $routeProvider.
        when('/', {
            title: 'home',
            controller: 'HomeController',
            controllerAs: 'vm',
            templateUrl: require("./home.tpl.html")
        });
    $locationProvider.html5Mode(true);
}