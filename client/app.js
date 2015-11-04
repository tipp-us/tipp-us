var app = angular.module('StarterApp', ['submerchant', 'ngMaterial','ui.router', 'geolocation', 'mgcrea.ngStrap', 'cloudinary','ngFileUpload'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo', {
      'default': '800', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '50', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    .accentPalette('pink')
    .backgroundPalette('indigo', {
      'default': '400', // by default use shade 400 from the pink palette for primary intentions
    });
    // .dark();
});
app.controller('photoUploadCtrl', ['$scope', '$location', 'Upload', function($scope, $location, $upload) {
  
  $scope.uploadFiles = function(files) {
    $scope.files = files;
    angular.forEach(files, function(file){
      if (file && !file.$error) {
        file.upload = $upload.upload({
          url: "https://api.cloudinary.com/v1_1/dalft4dfx/upload",
          fields: {
            upload_preset: "yx6jjrem",
          },
          file: file
        }).progress(function (e) {
          file.progress = Math.round((e.loaded * 100.0) / e.total);
          file.status = "Uploading... " + file.progress + "%";
        }).success(function (data, status, headers, config) {
          // data.context = {custom: {photo: $scope.title}};
          $scope.profile.imageUrl = data.url;
        }).error(function (data, status, headers, config) {
          file.result = data;
        });
      }
    });
    $scope.dragOverClass = function($event) {
      var items = $event.dataTransfer.items;
      var hasFile = false;
      if (items != null) {
        for (var i = 0 ; i < items.length; i++) {
          if (items[i].kind == 'file') {
            hasFile = true;
            break;
          }
        }
      } else {
        hasFile = true;
      }
      return hasFile ? "dragover" : "dragover-err";
    };
    
  }
}])
app.controller('AppCtrl', ['$rootScope', '$scope', '$state', '$mdSidenav', '$http', '$location','geolocation', '$mdDialog', function($rootScope, $scope, $state, $mdSidenav, $http, $location, geolocation, $mdDialog){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  $scope.currentShow = false;
  $scope.startNow = function() {
    $scope.changeState('home');

    geolocation.getLocation().then(function(data){
      var sendData = {
        lat:data.coords.latitude,
        long:data.coords.longitude
      };
      $http.post('/shows/startNow', sendData).then(function(data) {
        $scope.currentShow = true;
        alert('Show added');
      });
    });

    $scope.cancelShow = function() {
      $scope.currentShow = false;
    };
  };

  $scope.changeState = function(stateName) {
      $state.go('^.'+stateName);
      $mdSidenav('left').close();
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
      url: '/artists',
    }).success(function(data){
        data.forEach(function(element){
          $scope.searchableArtists.push({name: element.name, id: element.id});
          artistsArray.push(element.name);
        });
    });
  };
  $scope.getArtists();

  $scope.search = function(artist){
    // console.log(artist);
    $scope.searchableArtists.forEach(function(element){
      if(element.name === artist){
        $scope.artist = element;
        var self = {};
        self.artistList = [];
        $state.go('^.artists');
      }
    });
    $scope.artist = undefined;
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
      $scope.geoCalled = false;
      $scope.artistList = [];
      $scope.viewArtist = function(artist) {
        // console.log(artist);
        $scope.artist = artist;
        $state.go('^.artists');
      };
    },],

    onEnter: ['$rootScope', '$http', '$state', 'geolocation', function($scope, $http, $state, geolocation) {
      geolocation.getLocation().then(function(data) {
        $scope.geoCalled = true;
        $http.get('/artists/nearby', {params: {
            lat: data.coords.latitude,
            long: data.coords.longitude,
            numberOfArtists: 10,
            width: 200,
            height: 200,
          },}).success(function(data) {
          $scope.artistList = data.artists;
        });
      }, function(data){
        $scope.geoCalled = true;
        $state.go('^.home');
        alert('No artists found nearby.  Please turn on geolocation or search by artist/musician name.');
      });
      if ($scope.geoCalled && !($scope.artistList.length)) {
        $state.go('^.home');
        alert('No artists found nearby.  Please turn on geolocation or search by artist/musician name.');
      }
    },],

    controllerAs: 'nearbyCtrl',
  });

  $stateProvider.state('edit', {
    url: '/edit',
    templateUrl: 'views/edit.html',
    controller: ['$rootScope','$http','$state', '$mdDialog', function($scope, $http, $state, $mdDialog) {
      this.save = function() {
        var data = $scope.profile;
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
    controller: ['$rootScope', '$http','$state', 'geolocation', function($scope, $http, $state, geolocation) {
      $scope.upcomingShows;
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
      this.updateUpcomingShows = function() {
        $http.get('/upcomingShows')
          .success(function(data) {
          $scope.upcomingShows = data;
        });
      };

    }],

    onEnter: ['$rootScope', '$http', '$state', function($scope, $http, $state) {
      $http.get('/upcomingShows')
        .success(function(data) {
        $scope.upcomingShows = data;
      });
    },],

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
