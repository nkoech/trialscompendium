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
    vm.disableInputField = true;
    vm.selected = {};
    vm.filterSelectOptions = ['trial_id', 'observation', 'year', 'season', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'nitrogen_treatment', 'phosphate_treatment'];
    vm.filterTableData = ['trial_id', 'plot_id', 'sub_plot_id', '', 'observation', 'year', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'crops_grown', 'nitrogen_treatment', 'phosphate_treatment', 'short_rains', 'long_rains'];

    // Search one or more records per page
    // vm.queryPage = function (apiNode, query) {
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

    // Search one or more records per page
    vm.queryPage = function (apiNode, query) {
        vm.searching = true;
        trialService.search(apiNode, query).then(function (response) {
            // vm.results = response.results;
            vm.results = trialService.getTrials(response.results, vm.filterTableData);

            $timeout(function () {
                vm.searching = false;
            }, 500);
        });
    };
    vm.queryPage("trials/treatment/", {offset: 0, limit: 50});


    // Search one or more records in all pages
    vm.queryAllpages = function (apiNode, query) {
        vm.searching = true;
        trialService.searchAllPages(apiNode, query, []).then(function (response) {
            vm.selectOptions = storeService.pickTrials(response, vm.filterSelectOptions);
            $timeout(function () {
                vm.searching = false;
            }, 500);
        });
    };
    // vm.queryAllpages("trials/treatment/", {/*nitrogen_treatment__iexact: 'N0',*/ offset: 0, limit: 50});
}
