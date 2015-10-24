var helpers = require('../../server/helpers.js');

var calculatedDistance;
beforeEach(function() {
  var calculatedDistance = null;
});

describe('Server helpers', function() {
  it('should calculate distance correctly', function() {
    var calculatedDistance = helpers.getDistanceFromLatLonInKm(40.35, -119.44, 42.18, -116.34);
    expect(Math.floor(calculatedDistance)).to.equal(329);
  });

  // it('should fail when I expect it to', function() {
  //   expect('hello').to.equal('goodbye');
  // });
});
