angular
    .module('app.home')
    .controller('HomeController', HomeController);

HomeController.$inject = ['trialService', 'storeService', '$timeout'];

function HomeController(trialService, storeService, $timeout) {
    var vm = this;
    vm.results = false;
    vm.selectOptions = false;
    vm.searching = false;
    vm.trialSelected = false;
    vm.searchProp = ['trial_id', 'observation', 'year', 'season', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'nitrogen_treatment', 'phosphate_treatment'];

    // Search one or more records per page
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

    // Search one or more records in all pages
    vm.queryAllpages = function (apiNode, query) {
        vm.searching = true;
        trialService.searchAllPages(apiNode, query, []).then(function (response) {
            vm.selectOptions = storeService.pickTrials(response, vm.searchProp);
            $timeout(function () {
                vm.searching = false;
            }, 500);
        });
    };
    vm.queryAllpages("trials/treatment/", {/*nitrogen_treatment__iexact: 'N0',*/ offset: 0, limit: 50});
}
