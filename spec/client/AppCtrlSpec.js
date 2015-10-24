describe('AppCtrl', function() {

  var controller, scope;
  beforeEach(module('StarterApp'));
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    controller = $controller('AppCtrl', {
      $scope: scope,
    });
  }));

  describe('Initialization', function() {

    it('initializes all scope variables', function() {
      expect(scope.toggleSidenav).to.exist;
      expect(scope.currentShow).to.exist;
      expect(scope.startNow).to.exist;
      expect(scope.changeState).to.exist;
      expect(scope.searchableArtists).to.exist;
      expect(scope.getArtists).to.exist;
      expect(scope.search).to.exist;
    });

    it('should have a toggleSidenav function', function() {
      expect(scope.toggleSidenav).to.be.a('function');
    });

    it('should have a startNow function', function() {
      expect(scope.startNow).to.be.a('function');
    });

    it('should have a changeState function', function() {
      expect(scope.changeState).to.be.a('function');
    });

    it('should have a getArtists function', function() {
      expect(scope.getArtists).to.be.a('function');
    });

    it('should have a search function', function() {
      expect(scope.search).to.be.a('function');
    });

    it('should initialize variables to correct values', function() {
      expect(scope.currentShow).to.be.a('boolean').and.equal(false);
      expect(scope.searchableArtists).to.be.a('array');
      expect(scope.searchableArtists.length).to.equal(0);
    });

    // Sanity check
    // it('fails on purpose sometimes', function() {
    //   expect(scope.notARealThing).to.exist;
    // });
  });

  // // Doesn't work due to 'unexpected GET request', investigate further.
  // // Check into the modules 'superagent' and 'sinon'
  // describe('startNow', function() {
  //   it('should set currentShow to true and define a cancelShow function', function() {
  //     expect(scope.currentShow).to.equal(false);
  //     scope.startNow();
  //     expect(scope.currentShow).to.equal(true);
  //     expect(scope.cancelShow).to.exist;
  //     expect(scope.cancelShow).to.be.a('function');
  //   });
  // });

});
