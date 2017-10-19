angular
    .module('app.core')
    .factory('storeService', storeService);

storeService.$inject = ['localStorageService', 'uniqueObjFilter', 'pickObjFilter'];

function storeService(localStorageService, uniqueObjFilter, pickObjFilter) {
    var trials = [];
    var ls = localStorageService.get('store');

    if (ls !== null) {
        trials = ls;
    }

    return {
        'storeTrials': storeTrials,
        'getStoredTrials': getStoredTrials,
        'pickTrials': pickTrials,
        'uniqueTrials': uniqueTrials
    };

    function storeTrials(data) {
        trials.push(data);
        save();
    }

    function getStoredTrials() {
        return trials;
    }

    function pickTrials(data, filterProp){
        return pickObjFilter(data, filterProp);
    }

    function uniqueTrials(data){
        return uniqueObjFilter(data);
    }

    function save() {
        localStorageService.set('store', trials);
    }
}