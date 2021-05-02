(function() {
    'use strict';
    // Define directive and service methods where the factory methods are
    // registered with the angular module

    // Create angular module and name it NarrowItDownApp
    angular.module('NarrowItDownApp', [])
    // Resister Directives .controller, .directive, etc.

        // Declare and create a NarrowItDownController with directive name 'NarrowItDownController'
        .controller('NarrowItDownController', NarrowItDownController)
        // Declare and create MenuSearchService
        .service('MenuSearchService', MenuSearchService)

        .constant('APIBasePath', 'https://davids-restaurant.herokuapp.com')
        // Declare and create foundItems directive.
        .directive('foundItems', FoundItems);

// Define factory function that tells compiler to run through list items from directive 'foundItems'
    function FoundItems() {
        var ddo = {  //declare ddo
            templateUrl: 'foundItems.html', //output from html foundItems function
            restrict: 'EA', //<doc data="some_data"></doc> and <div Doc></div>
            scope: {   //define scope items
                items: '<', //one-way binding
                onRemove: '&' //provide an on-remove attribute
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'narrowIt',
            bindToController: true
        };
        return ddo;
    }

    function FoundItemsDirectiveController() {
        var narrowIt = this;
        narrowIt.isEmptyItems = function() {
            if (narrowIt.items !== undefined && narrowIt.items.length === 0) {
                return true;
            }
            return false;
        };
    }

// The NarrowItDownController should be injected with the MenuSearchService.
    NarrowItDownController.$inject = ['MenuSearchService'];

// The controller should call the getMatchedMenuItems method when appropriate and
// store the result in a property called found attached to the controller instance.
    function NarrowItDownController(MenuSearchService) {
        var narrowIt = this;
        narrowIt.narrowItDown = function() {
            var promise = MenuSearchService.getMatchedMenuItems(narrowIt.search);
            promise.then(function(result) {
                narrowIt.found = result;
            }).catch(function(e) {
                console.log(e.message);
            });
        };
        narrowIt.removeItem = function(itemIndex) {
            narrowIt.found.splice(itemIndex, 1);
        }
    }
    MenuSearchService.$inject = ['$http', 'APIBasePath'];

    function MenuSearchService($http, APIBasePath) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: 'GET',
                url: (APIBasePath + '/menu_items.json')
            }).then(function success(result) {
                var foundItems = [];
                if (searchTerm !== undefined && searchTerm.length > 0) {
                    searchTerm = searchTerm.toLowerCase();
                    for (var i = 0; i < result.data.menu_items.length; i++) {
                        var menu_item = result.data.menu_items[i];
                        var description = menu_item.description.toLowerCase();
                        if (description.indexOf(searchTerm) !== -1) {
                            foundItems.push(menu_item);
                        }
                    }
                }
                return foundItems;
            }, function error(response) {
                throw new Error("Error occured!");
            });

        };

    }

})();
