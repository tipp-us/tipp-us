var app = angular.module('StarterApp', ['ngMaterial','ui.router'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('blue')
    // .dark();
});

app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
}]);

// Controller for Tip mdDialog box

app.directive('artistList', function(){
  return {
    restrict: 'E',
    templateUrl: 'artistList.html',
    controller: ['$http', function($http) {
      var self = this;
      this.artistList = [];
      $http.get('/nearby').success(function(data) {
        self.artistList = data;
      });
      this.click = function(artist) {
        console.log(artist);
      };

    }],
    controllerAs: 'artistCtrl'
  };
});

function TipController($scope, $mdDialog){
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.pay = function(pay) {
    $mdDialog.hide(pay);
  };
};


app.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'home/home.html',

  })

  $stateProvider.state('artists', {
    url: '/artists',
    templateUrl: 'artists/artist.html',
  })

  $urlRouterProvider.otherwise('home');

});
