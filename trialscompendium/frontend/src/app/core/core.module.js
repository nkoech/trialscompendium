require('angular-animate');
require('angular-route');
require('angular-resource');
require('angular-sanitize');
require('angular-ui-bootstrap');
require('ui-select');

angular.module('app.core', [
    'ngAnimate',
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ui.select'
]);

require('./trial.fct');