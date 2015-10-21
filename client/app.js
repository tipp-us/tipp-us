var app = angular.module('StarterApp', ['ngMaterial','ui.router', 'geolocation', 'siyfion.sfTypeahead'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('blue');
    // .dark();
});

app.controller('AppCtrl', ['$scope', '$state', '$mdSidenav', '$http', '$location','geolocation', function($scope,$state, $mdSidenav, $http, $location,geolocation){
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
    }
  }

  $scope.changeState = function(stateName) {
      $state.go('^.'+stateName);
      $mdSidenav('left').toggle();
  };

/*===========================================================================/
/                             BRAINTREE DROPIN                               /
/===========================================================================*/
  $scope.message = 'Please specify tip amount in the form below:';
    $scope.showDropinContainer = true;
    $scope.loaded = false;
    $scope.isError = false;
    $scope.isPaid = false;
    $scope.getToken = function () {
      if($scope.loaded){
        return;
      } else {
        $http({
          method: 'GET',
          url: '/client_token'
        }).success(function (data) {
          // testing to see if correct client token accepted
          // console.log(data.clientToken);
          braintree.setup(data.clientToken, 'dropin', {
            container: 'tip-payment',
            // Form is not submitted by default when paymentMethodNonceReceived is implemented
            paymentMethodNonceReceived: function (event, nonce) {
              $scope.message = 'Processing your payment...';
              $scope.showDropinContainer = false;
              $http({
                method: 'POST',
                url: '/checkout',
                data: {
                  amount: $scope.amount,
                  payment_method_nonce: nonce
                }
              }).success(function (data) {
                console.log(data.success);
                if (data.success) {
                  $scope.message = 'Payment authorized, thanks for your support!';
                  $scope.showDropinContainer = false;
                  $scope.isError = false;
                  $scope.isPaid = true;
                } else {
                  $scope.message = 'Payment failed: ' + data.message + ' Please refresh the page and try again.';
                  $scope.isError = true;
                }
              });
            }
          });
        $scope.loaded = true;
        });
      }
    };
  // $scope.getToken();

/*===========================================================================/
/                             BRAINTREE MARKETPLACE                          /
/===========================================================================*/
  $scope.submerchant = {
    individual: {
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      dateOfBirth: null,
      ssn: null,
      address: {
        streetAddress: null,
        locality: null,
        region: null,
        postalCode: null,
      }
    },
    funding: {
      destination: 'Chase Bank', 
      accountNumber: null, 
      routingNumber: null,
    },
    tosAccepted: true,
    masterMerchantAccountId: "starvingartists",
};

$scope.bankingSubmit = function(){
  $http.post('/submerchant', {submerchantInfo: $scope.submerchant}).success(function(data) {
    console.log(data);  
  });
};

/*===========================================================================/
/                             SEARCH BAR                                     /
/===========================================================================*/
  $scope.searchableArtists = [];
  $scope.getArtists = function(){
    $http({
      method: 'GET',
      url: '/getAll',
    }).success(function(data){
        // $scope.searchableArtists= data;
        data.forEach(function(element){
          $scope.searchableArtists.push({artist: element.name});
        });
    });
  };
  $scope.getArtists();

  $scope.search = function(artist){
    $scope.searchableArtists.forEach(function(element){
      if(element.artist === artist.artist){
        // redirecting to signup page for the time being
        $location.url('/signup');
      }
    });
  };
/*===========================================================================/
/                             TYPEAHEAD                                      /
/===========================================================================*/

  // bloodhound suggestion engine with sample data
    // TODO delete this testing engine data when get is complete
  var artists = new Bloodhound({
    datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.artist); },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: [
      {artist: 'The Joes'},
      {artist: 'The Taylors'},
      {artist: 'The Kevins'},
      {artist: 'The Rods'},
    ]
    // prefetch: {
    //   url: '/getAll',
    //   filter: function(list){
    //     return $.map(list, function(artist){
    //       return {artist: artist};
    //     });
    //   }
    // }
  });

  artists.initialize();

  $scope.artistData = {
    displayKey: 'artist',
    source: artists.ttAdapter()
  };

  // This option highlights the main option
  $scope.exampleOptions = {
    highlight: true
  };
  
}]);

app.directive('artistList', ['$rootScope', '$state', function($scope, $state){
  return {
    restrict: 'E',
    templateUrl: 'artistList.html',
    controller: function($http,geolocation) {
      var self = this;
      this.artistList = [];
      this.click = function(artist) {
        $scope.artist = artist;
        $state.go('^.artists');
      };
      geolocation.getLocation().then(function(data){
        var coords = {position: {lat:data.coords.latitude, long:data.coords.longitude}};
        $http.post('/nearby',coords).success(function(data) {
          self.artistList = data;
        });
      });

    },
    controllerAs: 'artistCtrl'
  };
}]);

app.directive('artistDisplay', ['$rootScope', '$state', function($scope, $state){
  return {
    restrict: 'E',
    templateUrl: 'artistDisplay.html',
    controller: ['$http', function($http) {
      if(!$scope.artist) {
        $state.go('^.home');
      } else {
        var self = this;
        this.artistInfo = {};
        // as of 10-16, server still responding with dummy data
        $http.post('/artist', {artistId: $scope.artist.id}).success(function(data) {
          console.log('in artistDisplay. $scope.artist is...');
          console.log($scope.artist);
          console.log(data);
          self.info = data;
        });
        this.click = function(artist) {
          // console.log(artist);
        };
        this.go = function() {
          var art = $scope.artist;
          window.location.href = ("http://maps.google.com/maps?q="+art.position.lat+","+art.position.long+"+(My+Point)&z=14&ll="+art.position.lat+","+art.position.long);
        };
      }
    }],
    controllerAs: 'selectedArtist'
  };
}]);

app.directive('sideButtons', ['$rootScope', '$state', function($scope, $state){
  return {
    restrict: 'E',
    templateUrl: 'sideButtons.html',
    controller: ['$http', function($http) {
      $http.get('/loggedin').success(function(data){
        console.log(data);
        $scope.user = data;
      });
    }],
    controllerAs: 'sideButtons'
  };
}]);


app.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'home/home.html',
  });

  $stateProvider.state('artists', {
    url: '/artists',
    templateUrl: 'artists/artist.html',
  });

  $stateProvider.state('banking', {
    url: '/banking',
    templateUrl: 'artists/submerchant.html',
  });

  $stateProvider.state('edit', {
    url: '/edit',
    templateUrl: 'edit/edit.html',
    controller: ['$http','$state', function($http,$state) {
      this.save = function() {
        var data = this;
        data.image = window.image;
        $http.post('/edit/artist', data).success(function(rdata) {
          $state.go('^.home');
        });

      };
    }],
    controllerAs: 'editCtrl',
  });

  $stateProvider.state('add', {
    url: '/add',
    templateUrl: 'shows/addshow.html',
    controller: ['$http','$state', 'geolocation', function($http,$state, geolocation) {
      this.location = function() {
        var self = this;
        geolocation.getLocation().then(function(data){
          var coords = {lat:data.coords.latitude, long:data.coords.longitude};
          console.log(coords)
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
        }
        $http.post('shows/add', data).success(function(rdata) {
          state.go("^.home");
        })
      }

    }],
    controllerAs: 'addCtrl',
  });

  $stateProvider.state('login', {
  url: '/login',
  templateUrl: 'login/login.html',
  controller: ['$rootScope', '$http', '$state',function($scope, $http, $state) {
    this.formValid = true;
    this.login = function() {
      var form = {email: this.email,password: this.pass};
      var valid = this.email && this.pass;
      if(valid) {
        $http.post('/login/artist', form).success(function(data) {
          console.log(data);
          $state.go('^.edit');
          $http.get('/loggedin').success(function(user) {
            $scope.user = user;
          });
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
    templateUrl: 'signup/signup.html',
    controller: ['$rootScope', '$http', '$state',function($scope, $http, $state) {
      this.formValid = true;
      this.signup = function() {
        var form = {email: this.email,password: this.pass};
        var valid = this.email && this.pass && this.confirm;
        if(valid) {
          $http.post('/create/artist', form).success(function(data) {
            console.log(data);
            $state.go('^.edit');
            $http.get('/loggedin').success(function(user) {
              $scope.user = user;
            });
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

//http://stackoverflow.com/questions/14012239
app.directive("passwordVerify", function() {
   return {
      require: "ngModel",
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.passwordVerify || ctrl.$viewValue) {
               combined = scope.passwordVerify + '_' + ctrl.$viewValue; 
            }                    
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.passwordVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("passwordVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("passwordVerify", true);
                        return viewValue;
                    }
                });
            }
        });
     }
   };
});