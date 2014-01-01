/**
 * Module defines utility function that can be used to format string
 * The function is added to String prototype
 * 
 * Format item syntax: {index[,alignment]:format}
 * index      - index of an argument passed to formatString to insert into string
 * alignment  - Optional. Total length of string fragment into which argument is inserted. Negative integer used for left alignment.
 * format     - Optional. Format token for corresponding argument 
 * 
 * Format item examples:
 * {0}
 * {0,5}
 * {0,-5}
 * {1:d}
 * {2,-5:f} 
 * ...
 * 
 * Thoughts:
 * - i can add group (?:\s)* to allow whitespaces in the format item like this {0,   7}
 *   but i dont think that is a good idea.
 */
(function () {
  
  /**
   * Handy shorthands
   */
  var op = Object.prototype,
      ap = Array.prototype;
  
  /**
   * Pattern for extracting format items data
   */
  var itemPattern = /{(\d+)(?:,(-?\d+))?(?::(\w+))?}/g;
  
  /**
   * Handy references to groups in the match string.
   * Indexes in array returned by RegEx.exec()
   */
  var MATCH     = 0,
      INDEX     = 1,
      ALIGNMENT = 2,
      FORMAT    = 3;
  
  /**
   * @method Accepts string with parameter literals and list of argument
   * @param {string} target String to be formatted. Can contain parameter literals
   * @param {arguments} arguments Arbitrary number of arguments
   * @return {string} Formatted string
   */
  function formatString(target /*,args*/){
    var formatItems = [],
        result,
        args = ap.slice.call(arguments, 1);
    
    // Extract and format items
    try{
      while((result = itemPattern.exec(target)) != null) {
        var index = +result[INDEX];
        
        if(index >= args.length) {
          // throw or just skip it?
          throw new Error('index is out of bounds');
        }
        
        formatItems.push(result);
        
        result.formatted = alignString(formatValue(args[index], result[FORMAT]), result[ALIGNMENT]);
      }
    } finally {
      // Guarantee that 'lastIndex' property of RegExp object is set to 0
      // because same RegEx object is used to format all strings,
      // and it uses 'lastIndex' to start searching for next match
      itemPattern.lastIndex = 0;
    }
    
    // replace items in target string
    formatItems.forEach(function (item) {
      if(item.formatted){
        target = target.replace(item[MATCH], item.formatted);
      }
    });
    
    return target;
  }
  
  /**
   * @method TODO
   * @return {string} Formatted value
   */
  function formatValue(value, format) {
    if(format === undefined || format === null || format === ''){
      return value.toString();
    }
    
    // TODO: formatting stuff
  }
  
  /**
   * @method TODO
   * @param {string} str String to align
   * @param {number} alignment Number indicating the length of resulting string and alignment
   * @return {string} Aligned string
   */
  function alignString(str, alignment){
    var totalLength = 0;
    if(alignment){
      totalLength = alignment > 0 ? alignment : -1 * alignment;
      if(totalLength > str.length){
        if(alignment < 0){
          // Align left
          str = str + repeatStr(' ', totalLength - str.length);
        } else {
          // Align right
          str = repeatStr(' ', totalLength - str.length) + str;
        }
      }
    }
    
    return str;
  }
  
  /**
   * @method Repeat string
   * @param {string} str String to repeat
   * @param {Number} times Times to repeat string
   * @return {string} Resulting string
   */
  function repeatStr(str, times){
    var base = str, result = '', i=0;
    for(i = times; i > 0; i >>= 1){
      if(i & 1){
        result += base;
      }
      base += base;
    }
    
    return result;
  }
  
  // Add method format() to String prototype if it is not present. 
  // Or if format property of String prototype is not a function
  if(!('format' in String.prototype) || !(String.prototype.format instanceof Function)){
    String.prototype.format = function () {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this);
      return formatString.apply(this, args);
    };
  }
  
}());