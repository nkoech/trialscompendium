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
            'selected': '=',
            'selectOptions': '='
        },
        controller: SearchTrialController
    };
}

SearchTrialController.$inject = ['$scope', 'trialService'];

function SearchTrialController($scope, trialService) {
    $scope.elementAdded = false;
    $scope.selectOptions = [{
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
        "tillage_practice": "Zero Tillage"
    },{
        "tillage_practice": "Conventional"
    },{
        "farm_yard_manure": "Plus"
    },{
        "farm_yard_manure": "Minus"
    },{
        "farm_residue": "Plus"
    },{
        "farm_residue": "Minus"
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
    }];

    $scope.getSelectedTrial = function(prop) {
        $scope.disableInputField = false;
        if (prop === 'trial_id'){
            $scope.trialSelected = $scope.selected[prop][prop] === 'INM3' ? true : false;
            if (!$scope.elementAdded) {
                $scope.selectOptions = trialService.insertToArray($scope.selectOptions, 'observation', {"observation": "All Observations"}).slice(0);
                trialService.applyArray($scope, 'selectOptions');
                $scope.elementAdded = true;
            }
        }
    };

    $scope.resetForm = function(prop){
        if (prop === 'trial_id'){
            angular.forEach($scope.selected,function(value, key){
                if (key !== prop) {
                    $scope.selected[key] = undefined;
                }
            });
        }
    };
}

