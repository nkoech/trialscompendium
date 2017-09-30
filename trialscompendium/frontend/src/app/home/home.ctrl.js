angular
    .module('app.home')
    .controller('HomeController', HomeController);

HomeController.$inject = ['trialService', '$timeout'];

function HomeController(trialService, $timeout) {
    var vm = this;
    vm.results = false;
    vm.searching = false;

    vm.searchObj = {};

    vm.query = function(apiNode, query){
        vm.searching = true;
        trialService.search(apiNode, query).then(function (response) {
            vm.results = response;
            $timeout(function(){
                vm.searching = false;
            }, 500);
        }).catch(function (error) {

        });
    };

    // TODO test code to be deleted
    // vm.query("trials", {plot_id__iexact: 103});

    // TODO test code to be deleted
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