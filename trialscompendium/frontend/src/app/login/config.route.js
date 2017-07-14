angular
    .module('app.login')
    .config(routes);

routes.$inject = ["$routeProvider", "$locationProvider"];

function routes($routeProvider, $locationProvider) {
    $routeProvider.
        when('/login', {
            title: 'login',
            controller: 'LoginController',
            controllerAs: 'vm',
            templateUrl: require("./login.tpl.html")
        });
    $locationProvider.html5Mode(true);
}