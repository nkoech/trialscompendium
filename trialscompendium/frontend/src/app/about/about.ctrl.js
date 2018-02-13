angular
    .module('app.about')
    .controller('AboutController', AboutController);

function AboutController() {
    var vm = this;
    vm.loadImage = function(image) {
        return require('../../assets/img/' + image);
    };
}