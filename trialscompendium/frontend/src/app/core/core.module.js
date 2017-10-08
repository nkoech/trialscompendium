require('angular-animate');
require('angular-route');
require('angular-resource');
require('angular-sanitize');
require('angular-ui-bootstrap');
require('ui-select');
require('angular-local-storage');

angular.module('app.core', [
    'ngAnimate',
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ui.select',
    'LocalStorageModule'
]);

require('./trial.fct');
require('./store.fct');
require('./props.fltr');
require('./capitalize.fltr');
require('./slugify.fltr');