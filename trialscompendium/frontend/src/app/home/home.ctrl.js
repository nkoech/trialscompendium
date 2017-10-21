angular
    .module('app.home')
    .controller('HomeController', HomeController);

HomeController.$inject = ['trialService', 'storeService', '$timeout'];

function HomeController(trialService, storeService, $timeout) {
    var vm = this;
    vm.results = false;
    vm.trialsData = [];
    vm.selectOptions = false;
    vm.searching = false;
    vm.trialSelected = false;
    vm.disableInputField = true;
    vm.selected = {};
    vm.replaceValue = {Plus: true, Minus: false};
    vm.filterSelectOptions = ['trial_id', 'observation', 'year', 'season', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'nitrogen_treatment', 'phosphate_treatment'];
    vm.filterTableData = ['trial_id', 'plot_id', 'sub_plot_id', '', 'observation', 'year', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'crops_grown', 'nitrogen_treatment', 'phosphate_treatment', 'short_rains', 'long_rains'];

    // Get table trials data
    vm.getTrials = function(data) {
        angular.forEach(data, function (obj) {
            var objLevel, firstLevelData, secondLevelData,  thirdLevelData = '';
            angular.forEach(obj, function(value){
                if (value !== undefined && value !== null && typeof value === 'object'){
                    objLevel = trialService.getNestedTrials(value);
                    secondLevelData = trialService.filterMultiObj(objLevel.outObjArr, vm.filterTableData);
                    if (objLevel.nestedObj){
                        objLevel = trialService.getNestedTrials(objLevel.nestedObj, 'trial_yield', ['Short Rains', 'Long Rains']);
                        thirdLevelData = trialService.filterMultiObj(objLevel.outObjArr, vm.filterTableData);
                        thirdLevelData = trialService.mergeObj(thirdLevelData, ['observation', 'year']);
                    }
                }else{
                    firstLevelData = trialService.filterMultiObj([obj], vm.filterTableData, vm.replaceValue);
                }
            });

            // TODO: Code below can be put in a different function
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
        vm.searching = true;
        trialService.search(apiNode, query).then(function (response) {
            vm.results = vm.getTrials(response.results);
            // vm.results = trialService.getTrials(response.results, vm.filterTableData, vm.replaceValue);
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
            vm.selectOptions = storeService.pickTrials(response, vm.filterSelectOptions, vm.replaceValue);
            $timeout(function () {
                vm.searching = false;
            }, 500);
        });
    };
    // vm.queryAllpages("trials/treatment/", {/*nitrogen_treatment__iexact: 'N0',*/ offset: 0, limit: 50});
}
