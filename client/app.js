var app = angular.module('StarterApp', ['ngMaterial','ui.router', 'geolocation'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('blue');
    // .dark();
});

app.controller('AppCtrl', ['$scope', '$mdSidenav', '$http', function($scope, $mdSidenav, $http){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };
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
        console.log(data.clientToken);
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
    $scope.getToken();
}]);

// Controller for Tip mdDialog box

app.directive('artistList', function(){
  return {
    restrict: 'E',
    templateUrl: 'artistList.html',
    controller: function($http,geolocation) {
      var self = this;
      this.artistList = [];
      this.click = function(artist) {
        console.log(artist);
      };
      geolocation.getLocation().then(function(data){
        var coords = {lat:data.coords.latitude, long:data.coords.longitude};
        $http.post('/nearby',coords).success(function(data) {
          self.artistList = data;
        });
      });

    },
    controllerAs: 'artistCtrl'
  };
});

app.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'home/home.html',
  });

  $stateProvider.state('artists', {
    url: '/artists',
    templateUrl: 'artists/artist.html',
  });

  $urlRouterProvider.otherwise('home');

});
