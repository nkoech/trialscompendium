require('angular-animate');
require('angular-route');
require('angular-resource');
require('angular-sanitize');
require('angular-ui-bootstrap');
require('ui-select');
require('angular-local-storage');
require('angular-filter');

angular.module('app.core', [
    'ngAnimate',
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ui.select',
    'LocalStorageModule',
    'angular.filter'
]);

require('./trial.fct');
require('./store.fct');
require('./unique-obj.fltr');
require('./pick-obj.fltr');
// require('./str-replace.fltr');
// require('./bool-replace.fltr');

