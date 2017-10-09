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
            'selectOptions': '='
        },
        bindToController: true,
        controller: SearchTrialController,
        controllerAs: 'vm'
    };
}

function SearchTrialController() {
    var vm = this;
    vm.selected = false;
}

