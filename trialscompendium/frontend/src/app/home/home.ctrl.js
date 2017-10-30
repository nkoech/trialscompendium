angular
    .module('app.home')
    .controller('HomeController', HomeController);

// HomeController.$inject = ['pageTrials', 'allTrials', 'trialService', '$timeout', 'isEmptyFilter', 'strReplaceFilter'];
HomeController.$inject = ['pageTrials', 'trialService', '$timeout', 'isEmptyFilter', 'strReplaceFilter'];

// function HomeController(pageTrials, allTrials, trialService, $timeout, isEmptyFilter, strReplaceFilter) {
function HomeController(pageTrials, trialService, $timeout, isEmptyFilter, strReplaceFilter) {
    var vm = this;
    vm.results = false;
    vm.searched = false;
    vm.filterData = 0;
    vm.selectOptions = false;
    vm.searching = false;
    vm.searchBtnClicked = false;
    vm.trialSelected = false;
    vm.disableInputField = true;
    vm.selected = {};
    vm.sortColumn = 'plot_id';
    vm.reverse = false;
    vm.replaceValue = {Plus: true, Minus: false};
    vm.maxSize = 5;
    vm.totalResults = 0;
    vm.currentPage = 1;
    vm.pageSize = 5; // Maximum page size
    vm.pageParams = {offset: 0, limit: vm.pageSize};
    vm.baseURL = "trials/treatment/";
    vm.options = {psize: [5, 10, 25, 50]};
    vm.filterSelectOptions = ['trial_id', 'observation', 'year', 'season', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'nitrogen_treatment', 'phosphate_treatment'];
    vm.filterTableData = ['trial_id', 'plot_id', 'sub_plot_id', '', 'observation', 'year', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'crops_grown', 'nitrogen_treatment', 'phosphate_treatment', 'short_rains', 'long_rains'];

        // Get table trials data
    vm.getTrials = function(data) {
        vm.trialsData = [];
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

    vm.setResults = function (response) {
        var outObj = [];
        var respResults = vm.getTrials(response.results);
        if (vm.searchBtnClicked) {
            angular.forEach(respResults, function (resultsObj){
                var objMatch = [];
                angular.forEach(vm.selected, function (selValue, selKey){
                    if (angular.isArray(selValue)){
                        var inObjMatch = [];
                        angular.forEach(selValue, function (subSelValue) {
                            if (subSelValue[selKey] === 'Short Rains' || subSelValue[selKey] === 'Long Rains'){
                                var newKey = strReplaceFilter(subSelValue[selKey], ' ', '_').toLowerCase();
                                resultsObj.hasOwnProperty(newKey) ? inObjMatch.push(true) : inObjMatch.push(false);
                            }else{
                                subSelValue[selKey] === resultsObj[selKey] ? inObjMatch.push(true) : inObjMatch.push(false);
                            }
                        });
                        (inObjMatch.indexOf(true) !== -1 || selValue.length === 0) ? objMatch.push(true) : objMatch.push(false);
                    }else if (typeof selValue === 'object'){
                        selValue[selKey] === resultsObj[selKey] ? objMatch.push(true) : objMatch.push(false);
                    }
                });
                if (objMatch.indexOf(false) === -1) outObj = outObj.concat(resultsObj);
            });
            vm.results = outObj;
        }else{
            vm.totalResults = response.count;
            vm.results = respResults;
            vm.filterData = vm.results.length;
        }
    };

    // vm.getTrialsSearchOptions = function () {
    //     vm.searching = false;
    //     vm.selectOptions = trialService.filterSingleObj(allTrials, vm.filterSelectOptions, vm.replaceValue);
    //     $timeout(function () {
    //         vm.searching = false;
    //     }, 500);
    // };
    // vm.getTrialsSearchOptions();

    vm.getPageTrials = function () {
        if (pageTrials !== undefined || pageTrials !== null) {
            vm.searching = false;
            vm.setResults(pageTrials);
            $timeout(function () {
                vm.searching = false;
            }, 500);
        }
    };
    vm.getPageTrials();

    // Search one or more records in all pages
    // Usage: Default params: vm.queryAllpages("trials/treatment/",{offset: 0, limit: 50})
    vm.queryPage = function (apiNode, query) {
        vm.searching = true;
        trialService.search(apiNode, query).then(function (response) {
            vm.setResults(response);
            $timeout(function () {
                vm.searching = false;
            }, 500);
        });
    };

    // /**
    //  * TODO: DO NOT DELETE this function is so important.
    //  * Search one or more records in all pages
    //  * Usage: Default params: vm.queryAllpages("trials/treatment/",{offset: 0, limit: 50})
    //  **/
    // vm.queryAllpages = function (apiNode, query) {
    //     vm.searching = true;
    //     trialService.searchAllPages(apiNode, query, []).then(function (response) {
    //         vm.selectOptions = trialService.filterSingleObj(response, vm.filterSelectOptions, vm.replaceValue);
    //         $timeout(function () {
    //             vm.searching = false;
    //         }, 500);
    //     });
    // };

    vm.searchTrials = function (){
        if (!isEmptyFilter(vm.selected)) {
            vm.searchBtnClicked = true;
            vm.queryPage(vm.baseURL, vm.pageParams);
        }else{
            vm.searchBtnClicked = false;
        }

    };

    vm.sort_with = function(column) {
        vm.reverse = (vm.sortColumn === column) ? !vm.reverse : false;
        vm.sortColumn = column;
    };

    vm.onSearchTable = function() {
        $timeout(function() {
            vm.filterData = vm.searched.length;
        }, 20);
    };

    vm.changePageSize = function () {
        vm.pageParams.limit = vm.pageSize;
        vm.queryPage(vm.baseURL, vm.pageParams);
    };

    vm.pageChanged = function () {
        vm.pageParams.offset = (vm.currentPage - 1) * vm.pageSize;
        vm.queryPage(vm.baseURL, vm.pageParams);
    };
}
