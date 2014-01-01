var assert = require("assert");
require('../lib/string-format');

describe('String.format::general', function() {
  
  describe('loading module', function () {
    it('should add method "format" to String.prototype', function (){
      var format = 'format';
      assert(format in String.prototype && String.prototype[format] instanceof Function);
    });
  });
  
  describe('call format with no parameters', function () {
    it('should return same string', function () {
      var input = 'hello, world!';
      assert.equal(input, input.format());
    });
  });

  // Or may be should? xD
  describe.skip('call format with not enough arguments', function () {
    it('should not throw', function () {
      assert.doesNotThrow(function () { 'hello, {0}!'.format(); });
      assert.doesNotThrow(function () { 'hello, {0}! {1} {2} {3}'.format(); });
    });
  });

  describe('call format with more arguments then neccessary', function () {
    it('should not throw', function () {
      assert.doesNotThrow(function () { 'hello, {0}!'.format('Peter', 'Adam', 'Jeckil'); });
      assert.doesNotThrow(function () { 'hello, {0}! {1} {2} {3}'.format('Lyo', 'Suo', 'Jan', 'Tri', 'Chu'); });
    });
  });
  
  describe('call format with no alignment and format modifiers', function () {
    it('should call toString() for each parameter', function () {
      var input = 'hello, {0}!';
      var params = [
        'mellow',
        { value : 'world', id: 13, toString: function () { return this.value + '(' + this.id + ')'; }},
        5
      ];
      
      params.forEach(function(p) {
        assert.equal(input.format(p), input.replace(/{\d+}/, p.toString()));
      });
    });
  });
});