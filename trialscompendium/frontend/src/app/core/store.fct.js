angular
    .module('app.core')
    .factory('storeService', storeService);

storeService.$inject = ['localStorageService'];

function storeService(localStorageService) {
    var trials = [];
    var slicedTrials = [];
    var ls = localStorageService.get('store');

    if (ls !== null) {
        trials = ls;
    }

    return {
        'addTrial': addTrial,
        'getTrials': getTrials,
        'sliceTrials': sliceTrials
    };

    function addTrial(data) {
        trials.push(data);
        // save();
    }

    function getTrials() {
        return trials;
    }

    function sliceTrials(data, searchProp){
        angular.forEach(data, function (value, key) {
            var obj = {};
            if (value !== undefined && value !== null){
                if (typeof value === 'object'){
                    sliceTrials(value, searchProp);
                }else{
                    angular.forEach(searchProp, function (prop) {
                        if (prop === key) {
                            // Replace true and false js values with Plus and Minus string respectively
                            value = (value === true) ? 'Plus' : (value === false) ? 'Minus' : value;
                            obj[key] = value;
                            slicedTrials = slicedTrials.concat(obj);
                        }
                    });
                }
            }
        });
        return slicedTrials;
    }

    function save() {
        localStorageService.set('store', trials);
    }
}