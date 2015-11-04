app.controller('sideButtons', ['$rootScope', '$state', '$http', 'geolocation', '$mdSidenav', function($scope, $state, $http, geolocation, $mdSidenav) {
  $scope.searchableArtists = [];
  // $scope.nearbyArtists = null;
  $scope.nearbyArtists = [];
  var artistsArray = [];
  $scope.getArtists = function() {
    $http({
      method: 'GET',
      url: '/artists',
    }).success(function(data) {
      data.forEach(function(element) {
        $scope.searchableArtists.push({name: element.name, id: element.id});
        artistsArray.push(element.name);
      });
    });
  };
  $scope.getArtists();

  this.click = function(artist) {
    // console.log(JSON.stringify($scope.nearbyArtists));
    if($scope.artist !== undefined){
      $mdSidenav('left').toggle();
      $scope.searchableArtists.forEach(function(element) {
        if(element.name === artist) {
          $scope.artist = element;
          $state.go('^.artists', {}, {reload: true});
        }
      });
    }else{
      $mdSidenav('left').toggle();
    $scope.searchableArtists.forEach(function(element) {
      if(element.name === artist) {
        $scope.artist = element;
        $state.go('^.artists');
      }
    });
    $scope.nearbyArtists.forEach(function(element) {
      if(element.name === artist) {
        $scope.artist = element;
        $state.go('^.artists');
      }
    });
    }
  };
  this.clickNoSide = function(artist) {
    // console.log($scope.nearbyArtists);
    $scope.searchableArtists.forEach(function(element) {
      if(element.name === artist) {
        $scope.artist = element;
        $state.go('^.artists');
      }
    });
    $scope.nearbyArtists.forEach(function(element) {
      if(element.name === artist) {
        $scope.artist = element;
        $state.go('^.artists');
      }
    });
  };
  $scope.selectedArtist = "";
  $scope.artists = artistsArray;
  $http.get('/loggedin').success(function(data) {
    // console.log(data);
    $scope.user = data;
  });
}]);

app.directive('sideButtons', ['$rootScope', '$state', '$mdSidenav', function($scope, $state, $mdSidenav) {
  return {
    restrict: 'E',
    templateUrl: 'views/sideButtons.html',
    controller: 'sideButtons',
    controllerAs: 'sideButtons',
  };
}]);