// describe('artistlist', function() {
//   var scope, $compile, $rootScope, element, httpBackend, controller, $state;
//   var createDirective = function() {
//     element = angular.element('<artist-list></artist-list>');
//     $compile(element)($rootScope);
//     controller = element.controller('artistCtrl');
//     // console.log()
//     // scope.$digest();
//   };

//   beforeEach(module('StarterApp'));

//   beforeEach(inject(function(_$compile_, _$rootScope_, _$state_, $httpBackend) {
//     $compile = _$compile_;
//     $rootScope = _$rootScope_;
//     scope = $rootScope.$new();
//     httpBackend = $httpBackend;
//     $state = _$state_;

//     // console.log('Controller:', $controller);
//     // console.log('Scope:', scope);

//     httpBackend.expectGET('views/artistList.html').respond({});
//     httpBackend.expectGET('views/home.html').respond({});
//     createDirective();
//   }));

//   // afterEach(function() {
//   //   $httpBackend.verifyNoOutstandingExpectation();
//   //   $httpBackend.verifyNoOutstandingRequest();
//   // });

//   // // These don't work, possibly due to the way that they are
//   // // defined with this.click, etc, in the directive's controller.
//   // // TODO: investigate how to actually access these...
//   it('should have a click function', function() {
//     console.log('Controller:', controller);
//     expect(controller.click).to.be.a('function');
//   });

//   it('should initialize artistlist to an empty list', function() {
//     // expect(scope.artistlist.length).to.equal(0);
//   });

// });

describe('artistList', function() {
  var scope, elm, ctrl;

  // Load the myApp module, which contains the directive
  beforeEach(module('StarterApp'));
  beforeEach(module('my.templates'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function($compile, $rootScope, $controller, $httpBackend, geolocation) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    // $compile = _$compile_;
    elm = angular.element('<artist-list></artist-list>');
    scope = $rootScope;
    $compile(elm)(scope);

    // console.log(scope.$$phase);
    scope.$digest();
    // console.log(geolocation);
    // console.log(elm.controller.toString());
    // ctrl = $controller(elm.controller, {});
    // scope = $rootScope.$new();
  }));

  it('Replaces the element with the appropriate content', function() {
    // console.log(elm);
    expect(elm.html()).to.equal('<h4 ng-show="artistCtrl.artistList.artists.length" class="md-title textColor layout-align-center layout-row flex ng-hide" aria-hidden="true">Artists Nearby:</h4>\n<md-list role="list">\n  <!-- ngRepeat: artist in artistCtrl.artistList.artists -->\n</md-list>');
  });

  // // this is not the same click function, try again...
  // it('should have a click function', function() {
  //   // printPrototype(elm);
  //   console.log(ctrl);
  //   expect(elm.click).to.be.a('function');
  // });

  // it('should have an artistList initialized with length 0', function() {
  //   expect(elm.artistList).to.exist;
  //   expect(elm.artistList.length).to.equal(0);
  // });
});

function printPrototype(obj, i) {
  var n = Number(i || 0);
  var indent = Array(2 + n).join("-");

  for(var key in obj) {
  if(obj.hasOwnProperty(key)) {
  console.log(indent, key, ": ", obj[key]);
  }
  }

  if(obj) {
  if(Object.getPrototypeOf) {
  printPrototype(Object.getPrototypeOf(obj), n + 1);
  } else if(obj._proto_) {
  printPrototype(obj._proto_, n + 1);
  }
  }
}