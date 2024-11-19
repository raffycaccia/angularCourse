(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        ctrl.searchTerm = "";
        ctrl.emptyMessage = "";
        ctrl.found = [];

        ctrl.narrowItDown = function () {
            if (!ctrl.searchTerm) {
                ctrl.emptyMessage = "Nothing found";
                ctrl.found = [];
                return;
            }
            MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
                .then(function (response) {
                    ctrl.found = response;
                    ctrl.emptyMessage = ctrl.found.length === 0 ? "Nothing found" : "";
                })
                .catch(function (error) {
                    console.error("Error:", error);
                    ctrl.emptyMessage = "An error occurred while fetching data.";
                });
        };

        ctrl.removeItem = function (index) {
            ctrl.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json')
                .then(function (response) {
                    console.log("Response from API:", response.data); // Log the response
                    var allItems = response.data && response.data.menu_items ? response.data.menu_items : [];
                    return allItems.filter(function (item) {
                        return item && item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase());
                    });
                })
                .catch(function (error) {
                    console.error("Error fetching menu items:", error);
                    return [];
                });
        };
    }

    function FoundItemsDirective() {
        return {
            templateUrl: 'foundItems.html',
            scope: {
                items: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'dirCtrl',
            bindToController: true
        };
    }

    function FoundItemsDirectiveController() {
        var dirCtrl = this;
    }
})();
