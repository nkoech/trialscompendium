angular
    .module('app.home')
    .controller('HomeController', HomeController);

HomeController.$inject = ['researchService', '$timeout'];

function HomeController(researchService, $timeout) {
    var vm = this;
    vm.results = false;
    vm.searching = false;

    vm.searchObj = {};

    vm.query = function(apiNode, query){
        vm.searching = true;
        researchService.search(apiNode, query).then(function (response) {
            vm.results = response;
            $timeout(function(){
                vm.searching = false;
            }, 500);
        }).catch(function (error) {

        });
    };
    // vm.query("trials", {"plot_id__iexact": 103});
    
    vm.setSearchObj = function(obj) {
        if (typeof obj !== 'undefined') {
            angular.extend(vm.searchObj, obj);
            console.log(obj);
        }
    };
}