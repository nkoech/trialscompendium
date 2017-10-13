angular
    .module('app.core')
    .factory('storeService', storeService);

storeService.$inject = ['localStorageService', 'uniqueObjFilter'];

function storeService(localStorageService, uniqueObjFilter) {
    localStorageService.clearAll();
    var trials = [];
    var pickedTrials = [];
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

    function pickTrials(data, searchProp){
        angular.forEach(data, function (value, key) {
            var obj = {};
            if (value !== undefined && value !== null){
                if (typeof value === 'object'){
                    pickTrials(value, searchProp);
                }else{
                    angular.forEach(searchProp, function (prop) {
                        if (prop === key) {
                            // Replace true and false js values with Plus and Minus string respectively
                            value = (value === true) ? 'Plus' : (value === false) ? 'Minus' : value;
                            obj[key] = value;
                            pickedTrials = pickedTrials.concat(obj);
                        }
                    });
                }
            }
        });
        return pickedTrials;
    }

    function uniqueTrials(data){
        return uniqueObjFilter(data);
    }

    function save() {
        localStorageService.set('store', trials);
    }
}