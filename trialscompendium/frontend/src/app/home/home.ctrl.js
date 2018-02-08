angular
    .module('app.home')
    .controller('HomeController', HomeController);

// HomeController.$inject = ['pageTrials', 'allTrials', 'trialService', 'searchParamService', '$timeout', 'isEmptyFilter'];
HomeController.$inject = ['pageTrials', 'trialService', 'searchParamService','$timeout', 'isEmptyFilter'];

// function HomeController(pageTrials, allTrials, trialService, searchParamService, $timeout, isEmptyFilter) {
function HomeController(pageTrials, trialService, searchParamService, $timeout, isEmptyFilter) {
    var vm = this;
    vm.results = [];
    vm.searched = false;
    vm.filterData = 1;
    vm.selectOptions = false;
    vm.searching = false;
    vm.searchBtnClicked = false;
    vm.trialSelected = false;
    vm.disableInputField = true;
    vm.reverse = false;
    vm.searchingTable = false;
    vm.selected = {};
    vm.sortColumn = 'plot_id';
    vm.replaceFilterVal = {true: "Plus", false: "Minus"};
    vm.replaceValue = {Plus: true, Minus: false};
    vm.pagination = {
        offset: 0,
        maxSize: 5,
        pageSize: 5,
        totalResults: 0,
        currentPage: 1,
        totalPages: 0,
        pageOptions: {psize: [5, 10, 25, 50]}
    };
    vm.pageParams = {offset: vm.pagination.offset, limit: vm.pagination.pageSize};
    vm.baseURL = "trials/treatment/";
    vm.filterSelectOptions = ['trial_id', 'observation', 'year', 'season', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'nitrogen_treatment', 'phosphate_treatment'];
    vm.filterTableData = ['trial_id', 'plot_id', 'sub_plot_id', 'observation', 'year', 'tillage_practice', 'farm_yard_manure', 'farm_residue', 'crops_grown', 'nitrogen_treatment', 'phosphate_treatment', 'short_rains', 'long_rains'];
    vm.baseURLs = {
        trial_id: 'trials/',
        observation: 'trials/yield/',
        year: 'trials/yield/',
        season: 'trials/yield/',
        tillage_practice: 'trials/treatment/',
        farm_yard_manure: 'trials/treatment/',
        farm_residue: 'trials/treatment/',
        nitrogen_treatment: 'trials/treatment/',
        phosphate_treatment: 'trials/treatment/'
    };

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
                        thirdLevelData = trialService.groupObjBy(thirdLevelData, ['observation', 'year']);
                    }
                }
            });
            firstLevelData = trialService.filterMultiObj([obj], vm.filterTableData, vm.replaceValue);
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
        var selectedCopy = angular.copy(vm.selected);
        vm.pagination.totalResults = response.count;
        // vm.pagination.totalResults = response.length;
        vm.pagination.totalPages = trialService.calculateTotalPages(vm.pagination.pageSize, vm.pagination.totalResults);
        vm.results = vm.getTrials(response.results);
        // vm.results = vm.getTrials(response);
        if (vm.searchBtnClicked) {
            selectedCopy = trialService.removeProperty(selectedCopy, 'All');
            var outObj = trialService.getSearchedTrials(vm.results, selectedCopy, ['Short Rains', 'Long Rains']);

            // if (outObj.length === 0){
            //     vm.nextPage();
            // }else{
            //     vm.results = outObj;
            // }

            vm.results = outObj;
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

    // // TODO: DELETE when done. This a test function.
    // vm.queryAllXxx = function (apiNode, query) {
    //     vm.searching = true;
    //     trialService.searchAllPages(apiNode, query, []).then(function (response) {
    //
    //         console.log(response.length);
    //         var resultsX = vm.getTrials(response);
    //         console.log(resultsX.length);
    //         console.log('yyyyyyyyy');
    //
    //         // var selectedCopyX = angular.copy(vm.selected);
    //         // var selectedCopyX = trialService.removeProperty(selectedCopyX, 'All');
    //         // var outObjX = trialService.getSearchedTrials(resultsX, selectedCopyX, ['Short Rains', 'Long Rains']);
    //         // console.log(outObjX.length);
    //
    //         $timeout(function () {
    //             vm.searching = false;
    //         }, 500);
    //     });
    // };

    /**
     * TODO: DO NOT DELETE this function is so important.
     * Search one or more records in all pages
     * Usage: Default params: vm.queryAllpages("trials/treatment/",{offset: 0, limit: 50})
     **/
    vm.queryAllpages = function (apiNode, query) {
        vm.searching = true;
        trialService.searchAllPages(apiNode, query, []).then(function (response) {
            vm.selectOptions = trialService.filterSingleObj(response, vm.filterSelectOptions, vm.replaceValue);
            $timeout(function () {
                vm.searching = false;
            }, 500);
        });
    };

    vm.searchTrials = function (){
        if (!isEmptyFilter(vm.selected)) {
            vm.searchBtnClicked = true;
            searchParamService.setSearchParam(vm.baseURLs, vm.selected, vm.replaceFilterVal);
            vm.pageParams = {offset: vm.pagination.offset, limit: vm.pagination.pageSize};
            vm.queryPage(vm.baseURL, vm.pageParams);
            vm.pagination.currentPage = 1;

            // // // TODO: DELETE when done. This are test lines.
            // console.log('xxxxxxxxx');
            // var queryx = {offset: 0, limit: 200};
            // vm.queryAllXxx(vm.baseURL, queryx);

        }else{
            vm.searchBtnClicked = false;
        }
    };

    vm.sort_with = function (column) {
        vm.reverse = (vm.sortColumn === column) ? !vm.reverse : false;
        vm.sortColumn = column;
    };

    vm.onSearchTable = function (t) {
         vm.searchingTable = t;
        $timeout(function() {
            vm.filterData = vm.searched.length;
        }, 20);
    };

    vm.changePageSize = function () {
        vm.pagination.totalPages = trialService.calculateTotalPages(vm.pagination.pageSize, vm.pagination.totalResults);
        vm.pageParams.limit = vm.pagination.pageSize;
        vm.queryPage(vm.baseURL, vm.pageParams);
        vm.pagination.currentPage = 1;
    };

    vm.resetOffset = function () {
        vm.pageParams.offset = (vm.pagination.currentPage - 1) * vm.pagination.pageSize;
    };


    vm.pageChanged = function () {
        vm.resetOffset();
        vm.queryPage(vm.baseURL, vm.pageParams);
    };

    // TODO: DO NOT DELETE. To be used with ui-bootstrap pagination
    // vm.previousPage = function () {
    //     if (vm.pagination.currentPage > 1) {
    //         vm.pagination.currentPage--;
    //         vm.resetOffset();
    //         console.log(vm.pageParams.offset);
    //         vm.queryPage(vm.baseURL, vm.pageParams);
    //     }
    // };
    //
    // vm.nextPage = function () {
    //     if (vm.pagination.currentPage < vm.pagination.totalPages) {
    //         vm.pagination.currentPage++;
    //         vm.resetOffset();
    //         console.log(vm.pageParams.offset);
    //         vm.queryPage(vm.baseURL, vm.pageParams);
    //     }
    // };
    //
    // vm.noPrevious = function() {
    //     return vm.pagination.currentPage === 1;
    // };
    //
    // vm.noNext = function() {
    //     return vm.pagination.currentPage === vm.pagination.totalPages;
    // };
}
