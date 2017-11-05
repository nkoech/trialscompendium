angular
    .module('app.widgets')
    .directive('onFinishRepeat', onFinishRepeat);

onFinishRepeat.$inject = ['$timeout', '$parse'];

function onFinishRepeat($timeout, $parse) {
    return {
        restrict: 'A',
        link: link
    };

    // Link function should normally be placed outside the directive function.
    // This is an exception since passed arguments i.e. $timeout, $parse are
    // being used inside the link function and we need to make them available.
    function link(scope, element, attr) {
        if (scope.$last === true) {
            $timeout(function () {
                scope.$emit('ngRepeatFinished');
                if (!!attr.onFinishRepeat) {
                    $parse(attr.onFinishRepeat)(scope);
                }
            });
        }

        if (!!attr.onStartRepeat) {
            if (scope.$first === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatStarted');
                    if (!!attr.onStartRepeat) {
                        $parse(attr.onStartRepeat)(scope);
                    }
                });
            }
        }
    }
}




