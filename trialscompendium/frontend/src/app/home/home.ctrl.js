angular
    .module('app.home')
    .controller('HomeController', HomeController);

HomeController.$inject = ['trialService', '$timeout'];

function HomeController(trialService, $timeout) {
    var vm = this;
    vm.results = false;
    vm.searched = false;
    vm.filterData = 0;
    vm.trialsData = [];
    vm.selectOptions = false;
    vm.searching = false;
    vm.trialSelected = false;
    vm.disableInputField = true;
    vm.selected = {};
    vm.sortColumn = 'plot_id';
    vm.reverse = false;
    vm.replaceValue = {Plus: true, Minus: false};
    vm.totalResults = 0;
    vm.pageSize = 5; // Maximum page size
    vm.pageOffset = 0;
    vm.pageParams = {offset: vm.pageOffset, limit: vm.pageSize};
    vm.baseURL = "trials/treatment/";
    vm.options = {
        psize: [5, 10, 25, 50]
    };
    vm.filterSelectOptions = ['trial_id', 'observation', 'year', 'season', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'nitrogen_treatment', 'phosphate_treatment'];
    vm.filterTableData = ['trial_id', 'plot_id', 'sub_plot_id', '', 'observation', 'year', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'crops_grown', 'nitrogen_treatment', 'phosphate_treatment', 'short_rains', 'long_rains'];

    // Get table trials data
    vm.getTrials = function(data) {
        angular.forEach(data, function (obj) {
            var objLevel = '', firstLevelData = '', secondLevelData = '',  thirdLevelData = '';
            angular.forEach(obj, function(value){
                if (value !== undefined && value !== null && typeof value === 'object'){
                    objLevel = trialService.getNestedTrials(value);
                    secondLevelData = trialService.filterMultiObj(objLevel.outObjArr, vm.filterTableData);
                    if (objLevel.nestedObj){
                        objLevel = trialService.getNestedTrials(objLevel.nestedObj, 'trial_yield', ['Short Rains', 'Long Rains']);
                        thirdLevelData = trialService.filterMultiObj(objLevel.outObjArr, vm.filterTableData);
                        thirdLevelData = trialService.mergeOnSearch(thirdLevelData, ['observation', 'year']);
                    }
                }else{
                    firstLevelData = trialService.filterMultiObj([obj], vm.filterTableData, vm.replaceValue);
                }
            });

            // Merge all level data starting with the third level repeating the succeeding levels
            angular.forEach(thirdLevelData, function(thirdObj){
                angular.forEach(secondLevelData, function(secondObj){
                    angular.forEach(firstLevelData, function(firstObj){
                        vm.trialsData = vm.trialsData.concat(angular.merge({}, firstObj, secondObj, thirdObj));
                    });
                });
            });
        });
        return vm.trialsData;
    };

    // Search one or more records per page
    vm.queryPage = function (apiNode, query) {
        vm.searching = false;
        trialService.search(apiNode, query).then(function (response) {
            vm.totalResults = response.count;
            vm.results = vm.getTrials(response.results);
            vm.filterData = vm.results.length;
            $timeout(function () {
                vm.searching = false;
            }, 500);
        });
    };
    // vm.queryPage(vm.baseURL, {offset: 0, limit: 10});
    vm.queryPage(vm.baseURL, vm.pageParams);

    // Search one or more records in all pages
    vm.queryAllpages = function (apiNode, query) {
        vm.searching = true;
        trialService.searchAllPages(apiNode, query, []).then(function (response) {
            vm.selectOptions = trialService.filterSingleObj(response, vm.filterSelectOptions, vm.replaceValue);
            $timeout(function () {
                vm.searching = false;
            }, 500);
        });
    };
    vm.queryAllpages(vm.baseURL, {/*nitrogen_treatment__iexact: 'N0',*/ offset: 0, limit: 50});

    vm.sort_with = function(column) {
        vm.reverse = (vm.sortColumn === column) ? !vm.reverse : false;
        vm.sortColumn = column;
    };

    vm.onSearchTable = function() {
        $timeout(function() {
            vm.filterData = vm.searched.length;
        }, 20);
    };
}
