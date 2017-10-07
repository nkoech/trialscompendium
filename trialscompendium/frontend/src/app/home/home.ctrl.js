angular
    .module('app.home')
    .controller('HomeController', HomeController);

HomeController.$inject = ['trialService', '$timeout'];

function HomeController(trialService, $timeout) {
    var vm = this;
    vm.results = false;
    vm.searching = false;

    // vm.query = function (apiNode, query) {
    //     vm.searching = true;
    //     trialService.search(apiNode, query).then(function (response) {
    //         vm.results = response.results;
    //         $timeout(function () {
    //             vm.searching = false;
    //         }, 500);
    //         console.log(vm.results);
    //         // console.log(vm.count);
    //     });
    // };
    // vm.query("trials/treatment/", {offset: vm.offset, limit: vm.limit});

    vm.query = function (apiNode, query) {
        vm.searching = true;
        trialService.searchAllPages(apiNode, query, []).then(function (response) {
            vm.results = response;
            $timeout(function () {
                vm.searching = false;
            }, 500);
        });
    };
    vm.query("trials/treatment/", {nitrogen_treatment__iexact: 'N0', offset: 0, limit: 50});

}