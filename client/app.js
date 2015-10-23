var app = angular.module('StarterApp', ['ngMaterial','ui.router', 'geolocation', 'siyfion.sfTypeahead', 'mgcrea.ngStrap'])
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
      // $scope.showDropinContainer = true;
      // $scope.message = 'Please specify tip amount in the form below:';
  };

/*===========================================================================/
/                             BRAINTREE DROPIN                               /
/===========================================================================*/

var paymentConfirm = function(paid) {
  if(paid){
    alert = $mdDialog.alert({
      title: 'Success!',
      content: 'Your payment has been authorized, thanks for your support!',
      ok: 'Close'
    });
  }else{
    alert = $mdDialog.alert({
      title: 'Sorry!',
      content: 'Your payment method failed, please refresh the page and try again.',
      ok: 'Close'
    });
  }
  $mdDialog
    .show( alert )
    .finally(function() {
      alert = undefined;
    });
  };
  $scope.message = 'Please specify tip amount in the form below:';
    $scope.showDropinContainer = true;
    $scope.loaded = false;
    $scope.isError = false;
    $scope.isPaid = false;
    $scope.getToken = function () {
      if($scope.loaded){
        alert = $mdDialog.confirm({
          title: 'Again?',
          content: 'You\'re so kind! Are you sure you would like to tip again?',
          ok: 'Yes',
          cancel: 'No',
        });
        $mdDialog
          .show( alert )
          .finally(function() {
            alert = undefined;
            $scope.loaded = false;
            $scope.showDropinContainer = true;
          });
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
              // $scope.message = 'Processing your payment...';
              // $scope.showDropinContainer = false;
              $http({
                method: 'POST',
                url: '/checkout',
                data: {
                  amount: $scope.amount,
                  payment_method_nonce: nonce
                }
              }).success(function (data) {
                paymentConfirm(data.success);

                // if (data.success) {
                //   $scope.message = 'Payment authorized, thanks for your support!';
                  $scope.showDropinContainer = false;
                  $scope.message = null;
                //   $scope.isError = false;
                //   $scope.isPaid = true;
                // } else {
                //   $scope.message = 'Payment failed: ' + data.message + ' Please refresh the page and try again.';
                //   $scope.isError = true;
                // }
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
      destination: 'bank', 
      accountNumber: null, 
      routingNumber: null,
    },
    tosAccepted: true,
    masterMerchantAccountId: "starvingartists",
};

$scope.showAlert = function() {
  alert = $mdDialog.alert({
    title: 'Success!',
    content: 'Your banking information has been stored. You can now receive tips!',
    ok: 'Close'
  });
  $mdDialog
    .show( alert )
    .finally(function() {
      alert = undefined;
    });
  };

$scope.bankingSubmit = function(){
  $http.post('/submerchant', {submerchantInfo: $scope.submerchant}).success(function(data) {
    if(data.success){
      // Let the user know that they successfully signed up to receive tips
      $state.go('^.home');
      $scope.showAlert();
    }  
  });
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
        // $scope.searchableArtists= data;
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
        console.log(element);
        // redirecting to signup page for the time being
        // $location.url('/signup');
        $scope.artist = element;
        var self = {};
        console.log(self);
        self.artistList = [];
        $state.go('^.artists');
      }
    });
  };
/*===========================================================================/
/                             TYPEAHEAD                                      /
/===========================================================================*/
  // bloodhound suggestion engine with sample data
  var artists = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    sufficient: 3,
    // search engine only working when you type the local data first
    local: [
      {name: 'The Always Local'},
    ],
    remote: {
        url: '/getAll',
        filter: function(artists){
          return $.map(artists, function(artist){
            return {
              name: artist.name,
            };
          });
        },
        cache: true,
    }
  });

  artists.initialize();

  $scope.artistData = {
    displayKey: 'name',
    source: artists.ttAdapter(),
  };

  // This option highlights the main option
  $scope.exampleOptions = {
    highlight: true,
    hint: true,
    minLength: 1,
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
    controller: ['$rootScope','$http','$state', function($scope, $http,$state) {
      this.save = function() {
        var data = $scope.profile;
        data.image = window.image;
        $http.post('/edit/artist', data).success(function(rdata) {
          $state.go('^.home');
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
