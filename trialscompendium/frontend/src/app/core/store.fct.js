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
        'sliceTrials': sliceTrials,
        'uniqueTrialsFilter': uniqueTrialsFilter
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
                            obj[key] = value;
                            slicedTrials = slicedTrials.concat(obj);
                        }
                    });
                }
            }
        });
        return slicedTrials;
    }

    function uniqueTrialsFilter(data){
        var uniqueObj = [];
        var uniqueItems = [];
        angular.forEach(data, function (obj) {
            angular.forEach(obj, function (value) {
                if (uniqueItems.indexOf(value) === -1){
                    uniqueItems.push(value);
                    uniqueObj.push(obj);
                }
            });
        });
        return uniqueObj;
    }

    function save() {
        localStorageService.set('store', trials);
    }
}