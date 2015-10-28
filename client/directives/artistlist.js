app.controller('artistCtrl', ['$rootScope', '$state', '$http', 'geolocation', function($scope, $state, $http, geolocation) {
  var self = this;
  this.artistList = [];
  this.click = function(artist) {
    $scope.artist = artist;
    $state.go('^.artists');
  };

  geolocation.getLocation().then(function(data){
    $http({
      url: '/artists/nearby',
      method: 'GET',
      params: {
        lat: data.coords.latitude,
        long: data.coords.longitude,
        width: 200,
        height: 200,
      },
    }).success(function(data) {
      self.artistList = data;
    });
  });
},]);

app.directive('artistList', ['$rootScope', '$state', function($scope, $state) {
  return {
    restrict: 'E',
    templateUrl: 'views/artistList.html',
    controller: 'artistCtrl',
    controllerAs: 'artistCtrl',
  };
},]);
