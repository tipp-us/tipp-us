angular.module('submerchant', [])
  .controller('submerchCtrl', ['$scope', '$state', '$http', '$mdDialog', function($scope, $state, $http, $mdDialog){
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
      var alert = $mdDialog.alert({
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
          $state.go('^.home');
          $scope.showAlert();
        }  
      });
    };
}]);