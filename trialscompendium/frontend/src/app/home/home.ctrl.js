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
        offset: 0, maxSize: 5, pageSize: 2, totalResults: 0, currentPage: 1,
        pageOptions: {psize: [2, 4, 8, 16]}//, totalPages: 0,
    };
    vm.pageParams = {offset: vm.pagination.offset, limit: vm.pagination.pageSize};
    vm.baseURL = "trials/treatment/";
    vm.filterSelectOptions = [
        'trial_id', 'observation', 'year', 'season', 'tillage_practice', 'farm_yard_manure',
        'farm_residue', 'nitrogen_treatment', 'phosphate_treatment'
    ];
    vm.filterTableData = [
        'trial_id', 'plot_id', 'sub_plot_id', 'observation', 'year', 'tillage_practice', 'farm_yard_manure',
        'farm_residue', 'crops_grown', 'nitrogen_treatment', 'phosphate_treatment', 'short_rains', 'long_rains'
    ];
    vm.baseURLs = {
        trial_id: 'trials/', observation: 'trials/yield/', year: 'trials/yield/', season: 'trials/yield/',
        tillage_practice: 'trials/treatment/', farm_yard_manure: 'trials/treatment/', farm_residue: 'trials/treatment/',
        nitrogen_treatment: 'trials/treatment/', phosphate_treatment: 'trials/treatment/'
    };

    // Get data three level nested api node.Modify if more than three
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
        // vm.pagination.totalPages = trialService.calculateTotalPages(vm.pagination.pageSize, vm.pagination.totalResults);
        vm.results = vm.getTrials(response.results);
        if (vm.searchBtnClicked) {
            selectedCopy = trialService.removePropertyValue(selectedCopy, 'All');
            vm.results = trialService.getSearchedTrials(vm.results, selectedCopy, ['Short Rains', 'Long Rains']);
        }
    };

    // TODO: DO NOT DELETE. For searching search options
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

    /**
     * TODO: DO NOT DELETE this function is so important.
     * Search one or more records in all pages
     * Usage: Default params: vm.queryAllpages("trials/treatment/",{offset: 0, limit: 50})
     **/
    // vm.queryAllpages = function (apiNode, query) {
    //     vm.searching = true;
    //     trialService.searchAllPages(apiNode, query, []).then(function (response) {
    //         vm.selectOptions = trialService.filterSingleObj(response, vm.filterSelectOptions, vm.replaceValue);
    //         $timeout(function () {
    //             vm.searching = false;
    //         }, 500);
    //     });
    // };

    vm.queryId = function (apiNode, query, key) {
        vm.searching = true;
        return trialService.searchId(apiNode, query, key, {}).then(function (response) {
            if (response) {
                vm.searching = false;
                return response;
            }
        });
    };

    vm.addSearchParamProp = function (obj, propKey, propValue) {
        if (propKey in obj) {
            obj[propKey]['id__in'] = propValue;
        } else {
            obj[propKey] = {};
            obj[propKey]['id__in'] = propValue;
        }
    };

    vm.initQueryPage =function (obj, propKey) {
        obj[propKey]['offset'] = vm.pagination.offset;
        obj[propKey]['limit'] = vm.pagination.pageSize;
        vm.pageParams = obj[propKey];
        vm.queryPage(propKey, vm.pageParams);
        vm.pagination.currentPage = 1;
    };

    vm.queryApiNode = function (obj, propKey) {
        var treatment = 'trials/treatment/';
        vm.queryId(propKey, obj[propKey], 'treatment').then(function (response) {
            return response;
        }).then(function (response) {
            vm.addSearchParamProp(obj, treatment, response.id__in);
            vm.initQueryPage(obj, treatment);
        });
    };

    vm.searchTrials = function (){
        if (!isEmptyFilter(vm.selected)) {
            vm.searchBtnClicked = true;
            var searchParam = searchParamService.setSearchParam(vm.baseURLs, vm.selected, vm.replaceFilterVal);
            var offset = 0, limit = 500;
            if (Object.keys(searchParam).length > 0){
                var trials = 'trials/', trialsYield = 'trials/yield/';
                angular.forEach(searchParam, function (value, key) {
                    searchParam[key]['offset'] = offset;
                    searchParam[key]['limit'] = limit;
                    if (key === trialsYield) {
                        vm.queryId(trialsYield, searchParam[trialsYield], 'plot').then(function (response) {
                            return response; // Trial IDs collected
                        }).then(function (response) {
                            vm.addSearchParamProp(searchParam, trials, response.id__in);
                            vm.queryApiNode(searchParam, trials); // Collection of treatment IDs
                        });
                    } else if (key === trials && !(trialsYield in searchParam)){
                        vm.queryApiNode(searchParam, trials);
                    }
                });
            }
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
        // vm.pagination.totalPages = trialService.calculateTotalPages(vm.pagination.pageSize, vm.pagination.totalResults);
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
}
