angular
    .module('app.widgets')
    .directive('backgroundImage', backgroundImage);

function backgroundImage() {
    return function(scope, element, attrs){
        attrs.$observe('backgroundImage', function(src) {
            element.css({
                'background-image': 'url(' + src +')'
            });
        });
    };
}
