angular
    .module('app.widgets')
    .directive('searchTrial', searchTrial);

function searchTrial() {
    return {
        templateUrl: require('./search-trial.tpl.html'),
        restrict: 'EA',
        scope: {},
        bindToController: true,
        controller: SearchTrialController,
        controllerAs: 'vm'
    };
}

function SearchTrialController() {
    var vm = this;    
    vm.itemArray = [
        // {id: 1, name: '2000'},
        // {id: 2, name: '2017'},
        // {id: 3, name: '2010'},
        // {id: 4, name: '2015'},
        // {id: 5, name: '2006'},
        // {id: 6, name: '2010'},
        // {id: 7, name: '2015'},
        // {id: 8, name: '2006'}

        {id: 1, name: 'first'},
        {id: 2, name: 'second'},
        {id: 3, name: 'third'},
        {id: 4, name: 'fourth'},
        {id: 5, name: 'fifth'}
    ];

    vm.selected = { value: vm.itemArray[0] };
}

