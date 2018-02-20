angular
    .module('app.core')
    .factory('storeService', storeService);

storeService.$inject = ['localStorageService'];

function storeService(localStorageService) {
    var trials = [];
    var ls = localStorageService.get('store');

    if (ls !== null) {
        trials = ls;
    }

    return {
        'storeTrials': storeTrials,
        'getStoredTrials': getStoredTrials
    };

    function storeTrials(data) {
        trials.push(data);
        save();
    }

    function getStoredTrials() {
        return trials;
    }

    function save() {
        localStorageService.set('store', trials);
    }
}