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
            templateUrl: require("./home.tpl.html"),
            resolve: {
                pageTrials: function (trialService){
                    var apiNode = "trials/treatment/";
                    var query = {offset: 0, limit: 5};
                    return trialService.search(apiNode, query).then(function (response) {
                        return response;
                    });
                }
                // allTrials: function (trialService) {
                //     var apiNode = "trials/treatment/";
                //     var query = {offset: 0, limit: 100};
                //     return trialService.searchAllPages(apiNode, query, []).then(function (response) {
                //         return response;
                //     });
                // }
            }
        });
    $locationProvider.html5Mode(true);
}