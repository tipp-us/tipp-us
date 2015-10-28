app.controller('artistCtrl', ['$rootScope', '$state', '$http', 'geolocation', function($scope, $state, $http, geolocation) {
  var self = this;
  this.artistList = [];
  this.click = function(artist) {
    $scope.artist = artist;
    $state.go('^.artists');
  };
  geolocation.getLocation().then(function(data){
    var params = {
          position: {
            lat: data.coords.latitude,
            long:data.coords.longitude
          },
          numberOfArtists: 3,
          width: 200,
          height: 200,
        };
    $http.post('/artists/nearby', params).success(function(data) {
      self.artistList = data;
    });
  });
}]);

app.directive('artistList', ['$rootScope', '$state', function($scope, $state){
  return {
    restrict: 'E',
    templateUrl: 'views/artistList.html',
    controller: 'artistCtrl',
    controllerAs: 'artistCtrl',
  };
}]);