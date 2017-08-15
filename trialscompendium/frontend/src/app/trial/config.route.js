angular
    .module('app.trial')
    .config(routes);

routes.$inject = ["$routeProvider", "$locationProvider"];

function routes($routeProvider, $locationProvider) {
    $routeProvider.
        when('/trial/:id', {
            title: 'trial',
            controller: 'TrialController',
            controllerAs: 'vm',
            templateUrl: require("./trial.tpl.html")
        });
    $locationProvider.html5Mode(true);
}