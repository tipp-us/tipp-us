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

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('home');

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'home/home.html',
  })

  $stateProvider.state('artist', {
    url: '/artist',
    templateUrl: 'artist/artist.html',
  })
});
