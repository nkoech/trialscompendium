angular
    .module('app.core')
    .factory('storeService', storeService);

storeService.$inject = ['localStorageService', 'uniqueObjFilter', 'pickObjFilter'];

function storeService(localStorageService, uniqueObjFilter, pickObjFilter) {
    localStorageService.clearAll();
    var trials = [];
    var ls = localStorageService.get('store');

    if (ls !== null) {
        trials = ls;
    }

    return {
        'addTrials': addTrials,
        'getTrials': getTrials,
        'pickTrials': pickTrials,
        'uniqueTrials': uniqueTrials
    };

    function addTrials(data) {
        trials.push(data);
        save();
    }

    function getTrials() {
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