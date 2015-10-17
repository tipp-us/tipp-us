describe('AppCtrl', function () {

  var controller, scope;
  beforeEach(module('StarterApp'));
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    controller = $controller('AppCtrl', {
      $scope: scope
    });
  }));

  it('initializes a message to the scope', function () {
    expect(scope.message).to.be.a('string');
  });

  it('initializes the correct message to the scope', function () {
    expect(scope.message).to.equal('Please specify tip amount in the form below:');
  });

  // Sanity check
  // it('fails on purpose sometimes', function() {
  //   expect(scope.message).to.equal('hello');
  // });

});