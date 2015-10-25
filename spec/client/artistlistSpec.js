describe('artistlist', function() {
  var scope, $compile, $rootScope, element, httpBackend, $controller;
  var createDirective = function() {
    $compile(element)(scope);
    scope.$digest();
  };

  beforeEach(module('StarterApp'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$controller_, $httpBackend) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    $controller = _$controller_;

    httpBackend.expectGET('views/artistList.html').respond({});
    httpBackend.expectGET('views/home.html').respond({});
    element = angular.element('<artist-list></artist-list>');
    createDirective();
  }));

  // afterEach(function() {
  //   $httpBackend.verifyNoOutstandingExpectation();
  //   $httpBackend.verifyNoOutstandingRequest();
  // });

  // // These don't work, possibly due to the way that they are
  // // defined with this.click, etc, in the directive's controller.
  // // TODO: investigate how to actually access these...
  // it('should have a click function', function() {
  //   // expect(scope.click).to.be.a('function');
  // });

  // it('should initialize artistlist to an empty list', function() {
  //   // expect(scope.artistlist.length).to.equal(0);
  // });

});
