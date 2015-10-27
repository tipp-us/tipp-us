describe('artistCtrl', function() {
  var ctrl, state, rootScope, element, $compile;

  var createDirective = function() {
    element = angular.element('<artist-list></artist-list>');
    $compile(element)(rootScope);
    rootScope.$digest();
  };

  beforeEach(module('StarterApp'));
  beforeEach(module('my.templates'));

  beforeEach(inject(function($controller, $rootScope, $state, geolocation, _$compile_) {
    state = $state;
    rootScope = $rootScope;
    $compile = _$compile_;
    ctrl = $controller('artistCtrl', {
      $scope: $rootScope,
      geolocation: geolocation,
    });

    state.go('home');
    $rootScope.$digest();
  }));

  describe('artistCtrl', function() {
    it('should exist', function() {
      expect(ctrl).to.exist;
    });

    it('should have a click function', function() {
      expect(ctrl.click).to.exist;
      expect(ctrl.click).to.be.a('function');
    });

    it('should have an artistList array', function() {
      expect(ctrl.artistList).to.exist;
      expect(ctrl.artistList).to.be.a('array');
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

    it('should actually click', function() {
      var clickSpy = sinon.spy(ctrl, 'click');
      ctrl.click('');
      expect(clickSpy.calledOnce).to.equal(true);
    });

    it('should create the correct html element', function() {
      createDirective();
      expect(element.html()).to.contain("md-list");
    });

  });
});