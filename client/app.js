window.artists = {
  "artists":
    [
      {
        "name": "The Soggy Bottom Boys", 
        "location": "Boston MA",
        "pic": "picture of boys",
      },
      {
        "name": "The Soggy Bottom Girls", 
        "location": "Rome",
        "pic": "picture of ladies",
      },
      {
        "name": "The Soggy Bottom People", 
        "location": "Athens",
        "pic": "picture of people",
      }
    ],
  "numberOfArtists": 3,
  "searchLocation": 'location',
};

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
      // var self = this;
      // this.artistList = [];
      // $http.get('/SOMETHING.json').success(function(data) {
      //   self.artistList = data;
      // });
      this.artistList = window.artists;
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
