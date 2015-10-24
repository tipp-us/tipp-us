var app = angular.module('StarterApp', ['submerchant', 'ngMaterial','ui.router', 'geolocation', 'siyfion.sfTypeahead', 'mgcrea.ngStrap'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('pink');
    // .dark();
});

app.controller('AppCtrl', ['$rootScope', '$scope', '$state', '$mdSidenav', '$http', '$location','geolocation', '$mdDialog', function($rootScope, $scope, $state, $mdSidenav, $http, $location, geolocation, $mdDialog){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.currentShow = false;
  $scope.startNow = function() {
    $scope.currentShow = true;
    //get current id

    geolocation.getLocation().then(function(data){
      var sendData = {
        lat:data.coords.latitude,
        long:data.coords.longitude
      };
      $http.post('/shows/startNow',sendData).success(function(data) {
        
      });
    });

    $scope.cancelShow = function() {
      $scope.currentShow = false;
    };
  };

  $scope.changeState = function(stateName) {
      $state.go('^.'+stateName);
      $mdSidenav('left').toggle();
      $scope.loaded = false;
      $scope.isPaid = false;
  };

/*===========================================================================/
/                             SEARCH BAR                                     /
/===========================================================================*/
  $scope.searchableArtists = [];
  var artistsArray = [];
  $scope.getArtists = function(){
    $http({
      method: 'GET',
      url: '/getAll',
    }).success(function(data){
        data.forEach(function(element){
          $scope.searchableArtists.push({name: element.name, id: element.id});
          artistsArray.push(element.name);
        });
    });
  };
  $scope.getArtists();

  $scope.search = function(artist){
    console.log(artist);
    $scope.searchableArtists.forEach(function(element){
      if(element.name === artist){
        $scope.artist = element;
        var self = {};
        self.artistList = [];
        $state.go('^.artists');
      }
    });
  };
  
}]);

app.filter('distance', function () {
  return function (input) {
    return (input).toFixed(2) + ' miles';
  };
});
/*===========================================================================/
/                             UI Routes                                      /
/===========================================================================*/
app.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'views/home.html',
  });

  $stateProvider.state('artists', {
    url: '/artists',
    templateUrl: 'views/artist.html',
  });

  $stateProvider.state('banking', {
    url: '/banking',
    templateUrl: 'views/submerchant.html',
    controller: 'submerchCtrl',
  });

  // NEARBY ARTISTS //

  $stateProvider.state('nearby', {
    url: '/nearby',
    templateUrl: 'views/nearbyArtists.html',
    controller: ['$rootScope', '$http', '$state', function($scope, $http, $state) {
      $scope.artists = [];
      $scope.viewArtist = function(artist) {
        // console.log(artist);
        $scope.artist = artist;
        $state.go('^.artists');
      };
    }],
    onEnter: ['$rootScope', '$http', '$state', 'geolocation', function($scope, $http, $state, geolocation) {
      geolocation.getLocation().then(function(data){
        var params = {
          position: {
            lat: data.coords.latitude,
            long:data.coords.longitude
          },
          numberOfArtists: 10,
        };
        $http.post('/nearby',params).success(function(data) {
          $scope.artists= data.artists;
        });
      });
    }],
    controllerAs: 'nearbyCtrl',
  });

  $stateProvider.state('edit', {
    url: '/edit',
    templateUrl: 'views/edit.html',
    controller: ['$rootScope','$http','$state', '$mdDialog', function($scope, $http, $state, $mdDialog) {
      this.save = function() {
        var data = $scope.profile;
        data.image = window.image;
        $http.post('/edit/artist', data).success(function(rdata) {
          $state.go('^.home');
        });
      };
      this.info = function(){
        $state.go('^.banking');
        alert = $mdDialog.alert({
          title: 'Get Paid!',
          content: 'Link your bank account and start collecting tips instantly.',
          ok: 'Close'
        });
        $mdDialog
          .show( alert )
          .finally(function() {
            alert = undefined;
        });
      };
    }],
    onEnter: ['$rootScope','$http','$state', function($scope,$http,$state) {
      $scope.profile = {};
      $http.get('/edit/artist').success(function(data) {
        $scope.profile = data;
      });
      $http.get('/loggedin').success(function(data){
        console.log(data);
        $scope.user = data;
        if (data === '0') {
          $state.go('^.home');
        }
      });
    }],
    controllerAs: 'editCtrl',
  });

  $stateProvider.state('add', {
    url: '/add',
    templateUrl: 'views/addshow.html',
    controller: ['$http','$state', 'geolocation', function($http,$state, geolocation) {
      this.location = function() {
        var self = this;
        geolocation.getLocation().then(function(data){
          var coords = {lat:data.coords.latitude, long:data.coords.longitude};
          console.log(coords);
          self.lat = coords.lat;
          self.long = coords.long;
        });
      };
      this.add = function() {
        var data = {
          venue: this.venue,
          lat: this.lat,
          long: this.long,
          start: this.start,
          end: this.end,
          id: this.id,
        };
        $http.post('shows/add', data).success(function(rdata) {
          state.go("^.home");
        });
      };

    }],
    controllerAs: 'addCtrl',
  });

  $stateProvider.state('login', {
  url: '/login',
  templateUrl: 'views/login.html',
  controller: ['$rootScope', '$http', '$state',function($scope, $http, $state) {
    this.formValid = true;
    this.login = function() {
      var form = {email: this.email,password: this.pass};
      var valid = this.email && this.pass;
      if(valid) {
        $http.post('/login/artist', form).success(function(data) {
          console.log(data);
          $state.go('^.edit');
        });
      } else {
        this.formValid = false;
      }
    };
  }],
  controllerAs: 'loginCtrl'
});

  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: 'views/signup.html',
    controller: ['$rootScope', '$http', '$state',function($scope, $http, $state) {
      this.formValid = true;
      this.signup = function() {
        var form = {email: this.email,password: this.pass};
        var valid = this.email && this.pass && this.confirm;
        if(valid) {
          $http.post('/create/artist', form).success(function(data) {
            console.log(data);
            $state.go('^.edit');
          });
          
        } else {
          this.formValid = false;
        }
      };
    }],
    controllerAs: 'signupCtrl'
  });

  $urlRouterProvider.otherwise('home');

});
