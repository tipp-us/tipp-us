describe('sideButtons', function() {
  var ctrl, state, rootScope, element, $compile, $httpBackend, $mdSidenav;

  var createDirective = function() {
    element = angular.element('<side-buttons></side-buttons>');
    $compile(element)(rootScope);
    rootScope.$digest();
  };

  beforeEach(module('StarterApp'));
  beforeEach(module('my.templates'));

  beforeEach(inject(function($controller, $rootScope, $state, geolocation, _$compile_, _$httpBackend_, _$mdSidenav_) {
    state = $state;
    rootScope = $rootScope;
    $compile = _$compile_;
    $mdSidenav = _$mdSidenav_;

    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/artists').respond([
      {id:1, name: 'doug'}, {id: 2, name: 'taylor'}, {id: 3, name: 'kevin'}
    ]);
    $httpBackend.expectGET('/loggedin').respond({id: 13, name: 'bob'});

    ctrl = $controller('sideButtons', {
      $scope: $rootScope,
      geolocation: geolocation,
    });

    $httpBackend.flush();
    state.go('home');
    $rootScope.$digest();
  }));

  describe('sideButtons ctrl', function() {
    it('should exist', function() {
      expect(ctrl).to.exist;
    });

    it('should have a click function', function() {
      expect(ctrl.click).to.exist;
      expect(ctrl.click).to.be.a('function');
    });
    
    it('should have a clickNoSide function', function() {
      expect(ctrl.clickNoSide).to.exist;
      expect(ctrl.clickNoSide).to.be.a('function');
    });

    it('should have a searchableArtists array on scope', function() {
      expect(rootScope.searchableArtists).to.exist;
      expect(rootScope.searchableArtists).to.be.a('array');
      expect(rootScope.searchableArtists.length).to.equal(3);
    });

    it('should have a selectedArtist string on scope', function() {
      expect(rootScope.selectedArtist).to.exist.and.to.equal('');
    });

    it('should have an artists array on scope', function() {
      expect(rootScope.artists).to.exist;
      expect(rootScope.artists.length).to.equal(3);
    });

    it('should have a user obj on the scope', function() {
      expect(rootScope.user.id).to.equal(13);  
      expect(rootScope.user.name).to.equal('bob');  
    });

    it('have the right url', function() {
      expect(state.href('home')).to.equal('#/home');
    });

    it('should change states', function() {
      expect(state.current.name).to.equal('home');
      state.go('^.artists');
      rootScope.$digest();
      expect(state.current.name).to.equal('artists');
    });

    it('click should set scope.artist if match', function() {
      expect(rootScope.artist).to.not.exist;
      var clickSpy = sinon.spy(ctrl, 'click');
      ctrl.click('taylor');
      expect(clickSpy.calledOnce).to.equal(true);
      expect(rootScope.artist.name).to.equal('taylor');
    });

    it('clickNoSide should set scope.artist if match', function() {
      expect(rootScope.artist).to.not.exist;
      var clickSpy = sinon.spy(ctrl, 'clickNoSide');
      ctrl.clickNoSide('taylor');
      expect(clickSpy.calledOnce).to.equal(true);
      expect(rootScope.artist.name).to.equal('taylor');
    });

    it('should create the correct html element', function() {
      $httpBackend.expectGET('/artists').respond([
        {id:1, name: 'doug'}, {id: 2, name: 'taylor'}, {id: 3, name: 'kevin'}
      ]);
      $httpBackend.expectGET('/loggedin').respond({});
      createDirective();

      expect(element.html()).to.contain('<p style="text-align:center">ARTIST SECTION</p>');
    });

  });
});
