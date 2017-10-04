angular
    .module('app.home')
    .controller('HomeController', HomeController);

HomeController.$inject = ['trialService', '$timeout'];

function HomeController(trialService, $timeout) {
    var vm = this;
    vm.results = false;
    vm.searching = false;

    vm.query = function(apiNode, query){
        vm.searching = true;
        trialService.search(apiNode, query).then(function (response) {
            vm.results = response;
            $timeout(function(){
                vm.searching = false;
            }, 500);
        }).catch(function (error) {

        });
    };
}