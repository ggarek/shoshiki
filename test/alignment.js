var assert = require('assert');
require('../lib/string-format');

describe('String.format::general', function () {
  describe('#alignment', function () {
    it('foramtted parameter should not contain nor trailing neither leading spaces', function () {
      var input = '{0,0}',
          param = 'world';
    
      assert.equal(input.format(param), param);
    });
    
    it('foramtted parameter should be left aligned if alignment is negative integer', function () {
      var input = '{0,-7}',
          param = 'world',
          formatted = 'world  ';
      
      assert.equal(input.format(param), formatted);
    });
    
    it('foramtted parameter should be right aligned if alignment is positive integer', function () {
      var input = '{0,7}',
          param = 'world',
          formatted = '  world';
      
      assert.equal(input.format(param), formatted);
    });
  });
});