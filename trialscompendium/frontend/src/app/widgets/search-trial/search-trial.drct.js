angular
    .module('app.widgets')
    .directive('searchTrial', searchTrial);

function searchTrial() {
    return {
        templateUrl: require('./search-trial.tpl.html'),
        restrict: 'EA',
        scope: {
            'label': '@',
            'prop': '@',
            'multiple': '@',
            'trialSelected': '=',
            'disableInputField': '=',
            'selected': '='
            // 'selectOptions': '='
        },
        bindToController: true,
        controller: SearchTrialController,
        controllerAs: 'vm'
    };
}

function SearchTrialController() {
    var vm = this;

    vm.getSelectedTrial = function(prop) {
        vm.disableInputField = false;
        if (prop === 'trial_id'){
            if (vm.selected[prop][prop] === 'INM3') {
                vm.trialSelected = true;
            } else if (vm.selected[prop][prop] === 'CT1'){
                vm.trialSelected = false;
            }
        }
    };

    vm.resetForm = function(prop){
        if (prop === 'trial_id'){
            angular.forEach(vm.selected,function(value, key){
                if (key !== prop) {
                    vm.selected[key] = undefined;
                }
            });
        }
    };

    vm.selectOptions = [{
        "farm_yard_manure": "Plus"
    },{
        "farm_yard_manure": "Minus"
    },{
        "farm_residue": "Plus"
    },{
        "farm_residue": "Minus"
    },{
        "trial_id": "INM3"
    },{
        "trial_id": "CT1"
    },{
        "observation": "Maize Y"
    },{
        "observation": "Maize AGB"
    },{
        "observation": "Soy Y"
    },{
        "observation": "Soy AGB"
    },{
        "observation": "Teph AGB"
    },{
        "year": 2004
    },{
        "year": 2005
    },{
        "year": 2006
    },{
        "year": 2007
    },{
        "year": 2008
    },{
        "year": 2009
    },{
        "year": 2010
    },{
        "year": 2011
    },{
        "year": 2012
    },{
        "year": 2013
    },{
        "year": 2014
    },{
        "year": 2015
    },{
        "season": "Short Rains"
    },{
        "season": "Long Rains"
    },{
        "nitrogen_treatment": "N0"
    },{
        "nitrogen_treatment": "N30"
    },{
        "nitrogen_treatment": "N60"
    },{
        "nitrogen_treatment": "N90"
    },{
        "phosphate_treatment": "P0"
    },{
        "phosphate_treatment": "P60"
    },{
        "tillage_practice": "Zero Tillage"
    },{
        "tillage_practice": "Conventional Tillage"
    }];

    // vm.selectOptions = [{
    //     "nitrogen_treatment": "N30"
    // },{
    //     "phosphate_treatment": "P60"
    // },{
    //     "farm_yard_manure": "Plus"
    // },{
    //     "farm_yard_manure": "Minus"
    // },{
    //     "farm_residue": "Plus"
    // },{
    //     "farm_residue": "Minus"
    // },{
    //     "trial_id": "INM3"
    // },{
    //     "trial_id": "CT1"
    // },{
    //     "observation": "Maize Y"
    // },{
    //     "observation": "Maize AGB"
    // },{
    //     "observation": "Soy Y"
    // },{
    //     "observation": "Soy AGB"
    // },{
    //     "observation": "Teph Y"
    // },{
    //     "observation": "Teph AGB"
    // },{
    //     "year": 2004
    // },{
    //     "year": 2005
    // },{
    //     "year": 2006
    // },{
    //     "year": 2007
    // },{
    //     "year": 2008
    // },{
    //     "year": 2009
    // },{
    //     "year": 2010
    // },{
    //     "year": 2011
    // },{
    //     "year": 2012
    // },{
    //     "year": 2013
    // },{
    //     "year": 2014
    // }, {
    //     "year": 2015
    // }, {
    //     "season": "Short Rains"
    // },{
    //     "season": "Long Rains"
    // },{
    //     "tillage_practice": "Zero Tillage"
    // },{
    //     "tillage_practice": "Conventional Tillage"
    // },{
    //     "nitrogen_treatment": "N60"
    // },{
    //     "nitrogen_treatment": "N90"
    // },{
    //     "nitrogen_treatment": "N0"
    // },{
    //     "phosphate_treatment": "P0"
    // }];
}

