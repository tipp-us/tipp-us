window.artists = {
  "artists":
    [
      {
        "name": "The Soggy Bottom Boys", 
        "location": "70ft",
        "pic": "/assets/Band1.jpg",
      },
      {
        "name": "The Soggy Bottom Girls", 
        "location": ".2 miles",
        "pic": "/assets/Band2.png",
      },
      {
        "name": "The Soggy Bottom People", 
        "location": ".4 miles",
        "pic": "/assets/Band3.png",
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
