app.directive('artistDisplay', ['$rootScope', '$state', function($scope, $state){
  return {
    restrict: 'E',
    templateUrl: 'views/artistDisplay.html',
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