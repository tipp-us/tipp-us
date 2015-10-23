app.directive('sideButtons', ['$rootScope', '$state', '$mdSidenav', function($scope, $state, $mdSidenav){
  return {
    restrict: 'E',
    templateUrl: 'sideButtons.html',
    controller: function($http, geolocation) {
      $scope.searchableArtists = [];
      $scope.nearbyArtists = null;
      var artistsArray = [];
      $scope.getArtists = function(){
        $http({
          method: 'GET',
          url: '/getAll',
        }).success(function(data){
            data.forEach(function(element){
              $scope.searchableArtists.push({name: element.name, id: element.id});
              artistsArray.push(element.name);
            });
        });
      };
      $scope.getArtists();

      geolocation.getLocation().then(function(data){
        var coords = {position: {lat:data.coords.latitude, long:data.coords.longitude}};
        $http.post('/nearby',coords).success(function(data) {
          $scope.nearbyArtists = data.artists;
        });
      });

      this.click = function(artist) {
        console.log($scope.nearbyArtists);
        $mdSidenav('left').toggle();
        $scope.searchableArtists.forEach(function(element){
          if(element.name === artist){
            $scope.artist = element;
            $state.go('^.artists');
          }
        });
        $scope.nearbyArtists.forEach(function(element){
          if(element.name === artist){
            $scope.artist = element;
            $state.go('^.artists');
          }
        });
      };
      this.clickNoSide = function(artist) {
        console.log($scope.nearbyArtists);
        $scope.searchableArtists.forEach(function(element){
          if(element.name === artist){
            $scope.artist = element;
            $state.go('^.artists');
          }
        });
        $scope.nearbyArtists.forEach(function(element){
          if(element.name === artist){
            $scope.artist = element;
            $state.go('^.artists');
          }
        });
      };
      $scope.selectedArtist = "";
      $scope.artists = artistsArray;
      $http.get('/loggedin').success(function(data){
        console.log(data);
        $scope.user = data;
      });
    },
    controllerAs: 'sideButtons'
  };
}]);