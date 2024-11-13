(function() {
    'use strict';

    angular.module('LunchCheck', [])
    .controller('LunchCheckController', LunchCheckController);

    LunchCheckController.$inject = ['$scope'];
    function LunchCheckController($scope) {
        $scope.lunchItems = "";
        $scope.lunchMessage = "";

        $scope.checkLunch = function() {
            if ($scope.lunchItems.trim() === "") {
                $scope.lunchMessage = "Please enter data first";
            } else {
                var itemsArray = $scope.lunchItems.split(',').filter(item => item.trim() !== "");
                if (itemsArray.length <= 3) {
                    $scope.lunchMessage = "Enjoy!";
                } else {
                    $scope.lunchMessage = "Too much!";
                }
            }
        };
    }
})();
