angular
    .module('app.about')
    .controller('AboutController', AboutController);

function AboutController() {
    var vm = this;
    vm.slideInterval = 5000;

    vm.loadImage = function(imageUrl) {
        return require('../../assets/img/' + imageUrl);
    };

    vm.inm3Slides = [
        {
            image: require('../../assets/img/inm3_1.jpg')
        },{
            image: require('../../assets/img/inm3_2.jpg')
        },{
            image: require('../../assets/img/inm3_3.jpg')
        }
    ];

    vm.ct1Slides = [
        {
            image: require('../../assets/img/ct1_1.jpg')
        },{
            image: require('../../assets/img/ct1_2.jpg')
        },{
            image: require('../../assets/img/ct1_3.jpg')
        },{
            image: require('../../assets/img/ct1_4.jpg')
        }
    ];
}