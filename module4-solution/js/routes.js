(function () {
  'use strict';

  angular.module('MenuApp')
    .config(RoutesConfig);

  RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
  function RoutesConfig($stateProvider, $urlRouterProvider) {

    // Default route
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('main', {
        abstract: true,
        templateUrl: 'templates/main-layout.html',
      })

      .state('main.home', {
        url: '/',
        templateUrl: 'templates/home.template.html',
      })

      .state('main.categories', {
        url: '/categories',
        templateUrl: 'templates/categories.template.html',
        controller: 'CategoriesController as categoriesCtrl',
        resolve: {
          items: ['MenuDataService', function (MenuDataService) {
            return MenuDataService.getAllCategories();
          }]
        }
      })

      .state('main.items', {
        url: '/items/{categoryShortName}',
        templateUrl: 'templates/items.template.html',
        controller: 'ItemsController as itemsCtrl',
        resolve: {
          items: ['$stateParams', 'MenuDataService', function ($stateParams, MenuDataService) {
            return MenuDataService.getItemsForCategory($stateParams.categoryShortName);
          }]
        }
      });
  }
})();
