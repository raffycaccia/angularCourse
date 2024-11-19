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
        ctrl.found = [];
        ctrl.emptyMessage = "";

        ctrl.narrowItDown = function () {
            if (!ctrl.searchTerm || ctrl.searchTerm.trim() === "") {
                ctrl.emptyMessage = "Nothing found";
                ctrl.found = [];
                return;
            }

            MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
                .then(function (foundItems) {
                    ctrl.found = foundItems;
                    ctrl.emptyMessage = ctrl.found.length === 0 ? "Nothing found" : "";
                })
                .catch(function (error) {
                    console.error("Error occurred:", error);
                    ctrl.emptyMessage = "Unable to retrieve data.";
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
                    var data = response.data;
                    var allItems = [];

                    // Naviga attraverso le categorie per raccogliere tutti gli elementi menu_items
                    Object.keys(data).forEach(function (key) {
                        if (data[key].menu_items) {
                            allItems = allItems.concat(data[key].menu_items);
                        }
                    });

                    // Filtra gli elementi in base al termine di ricerca
                    var foundItems = allItems.filter(function (item) {
                        return item.description &&
                               item.description.toLowerCase().includes(searchTerm.toLowerCase());
                    });

                    return foundItems;
                })
                .catch(function (error) {
                    console.error("HTTP request error:", error);
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
