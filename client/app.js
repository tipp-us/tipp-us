var app = angular.module('StarterApp', ['ngMaterial','ui.router', 'geolocation', 'siyfion.sfTypeahead'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('blue');
    // .dark();
});

app.controller('AppCtrl', ['$scope', '$state', '$mdSidenav', '$http', '$location', function($scope,$state, $mdSidenav, $http, $location){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
/*===========================================================================/
/                             BRAINTREE DROPIN                               /
/===========================================================================*/
  $scope.message = 'Please specify tip amount in the form below:';
    $scope.showDropinContainer = true;
    $scope.isError = false;
    $scope.isPaid = false;
    $scope.getToken = function () {
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
      });
    };
  // $scope.getToken();

/*===========================================================================/
/                             BRAINTREE MARKETPLACE                          /
/===========================================================================*/
  merchantAccountParams = {
  individual: {
    firstName: "Taylor",
    lastName: "Hayduk",
    email: "example@gmail.com",
    phone: "5555555555",
    dateOfBirth: "2015-10-20",
    ssn: "555-55-5555",
    address: {
      streetAddress: "123 Test St",
      locality: "Los Angeles",
      region: "CA",
      postalCode: "91210"
    }
  },
  // below not needed if band is not a registered business
  business: {
    legalName: "The Taylors",
    taxId: "98-7654321",
    address: {
      streetAddress: "123 Test St",
      locality: "Los Angeles",
      region: "CA",
      postalCode: "91210"
    }
  },
  funding: {
    descriptor: "Taylor's Bank", // optional
    destination: 'MerchantAccount.FundingDestination.Bank', // could be email, pnone, or bank
    email: "example@gmail.com", // Venmo
    mobilePhone: "5555555555", // Venmo
    accountNumber: "1123581321", // required if bank is main option
    routingNumber: "071101307"
  },
  tosAccepted: true,
  masterMerchantAccountId: "taylorhayduck_marketplace",
  id: "taylor_band"
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
  controller: ['$http', '$state',function($http, $state) {
    this.formValid = true;
    this.login = function() {
      var form = {email: this.email,password: this.pass};
      var valid = this.email && this.pass;
      if(valid) {
        $http.post('/artist', form).success(function(data) {
          console.log(data);
          $state.go('^.home');
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
    controller: ['$http', '$state',function($http, $state) {
      this.formValid = true;
      this.signup = function() {
        var form = {email: this.email,password: this.pass};
        var valid = this.email && this.pass && this.confirm;
        if(valid) {
          $http.post('/create/artist', form).success(function(data) {
            console.log(data);
            $state.go('^.home');
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