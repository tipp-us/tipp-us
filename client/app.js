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
/                             BRAINTREE                                      /
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
/                             SEARCH BAR                                     /
/===========================================================================*/
  $scope.searchableArtists = null;
  $scope.getArtists = function(){
    $http({
      method: 'GET',
      url: '/getAll',
    }).success(function(data){
      $scope.searchableArtists = data.artists;
    });
  };
  $scope.getArtists();
  $scope.search = function(artist){
    $scope.searchableArtists.forEach(function(element){
      if(element.name === artist.artist){
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

  $scope.changeState = function(stateName) {
    $state.go('^.'+stateName);
    $mdSidenav('left').toggle();
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


app.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'home/home.html',
  });

  $stateProvider.state('artists', {
    url: '/artists',
    templateUrl: 'artists/artist.html',
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

    $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'login/login.html',
    controller: ['$http', '$state',function($http, $state) {
      this.formValid = true;
      this.login = function() {
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
    controllerAs: 'loginCtrl'
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