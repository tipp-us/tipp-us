app.directive('artistDisplay', ['$rootScope', '$state', '$mdDialog', function($scope, $state, $mdDialog){
  return {
    restrict: 'E',
    templateUrl: 'views/artistDisplay.html',
    controller: ['$http', function($http) {
      if (!$scope.artist) {
        $state.go('^.home');
      } else {
        var self = this;
        this.artistInfo = {};
        // as of 10-16, server still responding with dummy data
        $http.get('/artists/' + $scope.artist.id).success(function(data) {
        // $http.get('/artists/id', {params: {artistId: $scope.artist.id}}).success(function(data) {
        // $http.post('/artist', {artistId: $scope.artist.id}).success(function(data) {
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
                braintree.setup(data.clientToken, 'dropin', {
                  container: 'tip-payment',
                  // Form is not submitted by default when paymentMethodNonceReceived is implemented
                  paymentMethodNonceReceived: function (event, nonce) {
                    $http({
                      method: 'POST',
                      url: '/checkout',
                      data: {
                        amount: $scope.amount,
                        payment_method_nonce: nonce
                      }
                    }).success(function (data) {
                      paymentConfirm(data.success);
                        $scope.showDropinContainer = false;
                        $scope.message = null;
                    });
                  }
                });
              $scope.loaded = true;
              });
            }
      };
    }],
    controllerAs: 'selectedArtist'
  };
}]);
