angular
    .module('app.layout')
    .controller('CollapseSectionController', CollapseSectionController);

function CollapseSectionController() {
    var vm = this;
    vm.isNavCollapsed = true;
}