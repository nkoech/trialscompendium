require('../assets/css/main.css');
require('angular');
require('immutable');
require('./core/core.module');
require('./layout/layout.module');
require('./home/home.module');
require('./about/about.module');
require('./login/login.module');
require('./sign-up/sign-up.module');
require('./trial/trial.module');
require('./widgets/widgets.module');

angular.module('app', [
    'app.core',
    'app.layout',
    'app.home',
    'app.about',
    'app.login',
    'app.sign-up',
    'app.trial',
    'app.widgets'
]);