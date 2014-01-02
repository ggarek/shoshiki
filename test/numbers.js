/**
 * Thoughts:
 * - May be use some 'resource' file with test data..
 */
var assert = require('assert');
require('../lib/string-format');

describe('String.format::numbers', function () {
  describe('#custom number format', function () {
    it('', function () {
      var data = [
        {
          input       : '{0},{1},{2}',
          params      : [1,2,3],
          formatted   : '1,2,3'
        },
        {
          input       : '{0,0},{1,0},{2,0}',
          params      : [1,2,3],
          formatted   : '1,2,3'
        },
        {
          input       : '{0,2},{1,2},{2,2}',
          params      : [1,2,3],
          formatted   : ' 1, 2, 3'
        },
        {
          input       : '{0,-2},{1,-2},{2,-2}',
          params      : [1,2,3],
          formatted   : '1 ,2 ,3 '
        },
        {
          input       : '{0:00},{1:00},{2:00}',
          params      : [1,2,3],
          formatted   : '01,02,03'
        },
        {
          input       : '{0:0000} {1:#000} {2:000#} {3:0##000}',
          params      : [123, 456, 789, 123],
          formatted   : '0123 456 0789 000123'
        },
        {
          input       : '{0:^#} {1:^#^} {2:#^#*} {3:0##-00-^*^-}',
          params      : [123, 456, 789, 123],
          formatted   : '^123 ^456^ 78^9* 001-23-^*^-'
        },
        {
          input       : '{0:#-#-#} {1:##-#-#} {2:0#-#-##} {3:#-#-000}',
          params      : [123, 456, 789, 123],
          formatted   : '1-2-3 4-5-6 00-7-89 --123'
        },
        {
          input       : '{0:0.00} {1:0000.##0} {2:####.0.0.0} {3:#-#-#.###00.0} {4:000.00}',
          params      : [123.56, 456.12, 789.123, 123.456, 456.789],
          formatted   : '123.56 0456.120 789.123 1-2-3.456000 456.78'
        },
        {
          input       : '{0:0.#-#} {1:0000.#*#*0} {2:####.0.-0.-0} {3:#^#.#-#---} {4:#-#.0-0-0-0}',
          params      : [123.56, 456.12, 789.123, 123.456, 456.789],
          formatted   : '123.5-6 0456.1*2*0 789.1-2-3 12^3.4-5--- 45-6.7-8-9-0'
        }
      ];
      
      data.forEach(function (item) {
        assert.equal(String.prototype.format.apply(item.input, item.params), item.formatted);
      });
    });
  });
});