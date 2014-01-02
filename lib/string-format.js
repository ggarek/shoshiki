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
 * Supported format tokens:
 * > Numbers
 *    0 - Zero placeholder - Replaces the zero with the corresponding digit if one is present. Otherwise, zero appears in the result string.
 *    # - Digit placeholder - Replaces the symbol with the corresponding digit if one is present. Otherwise, no digit appears in the result string.
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
      ap = Array.prototype,
      toStr = 'toString';
  
  /**
   * Pattern for extracting format items data
   */
  var itemPattern = /{(\d+)(?:,(-?\d+))?(?::([\w\#\.,-\^]+))?}/g;
  
  /**
   * Handy references to groups in the match string.
   * Indexes in array returned by RegEx.exec()
   */
  var MATCH       = 0,
      INDEX       = 1,
      ALIGNMENT   = 2,
      FORMAT      = 3;
  /**
   * String alignment constants
   */
  var ALIGN_LEFT  = -1,
      ALIGN_RIGHT = 1;
  
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
        
        result.formatted = alignString(
          formatValue(args[index], result[FORMAT]), 
          abs(result[ALIGNMENT]), 
          sign(result[ALIGNMENT])
        );
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
    //    console.log('value='+value+'; format='+format);
    // IF there is no format token
    if(format === undefined || format === null || format === ''){
      // IF value has method toString
      if(value[toStr] && value[toStr] instanceof Function){
        return value.toString();
      } else {
        // ELSE call Object.toString()
        return op.toString.call(value);
      }
    }
    
    // TODO: formatting stuff
    return customFormatNumber(value, format);
  }
  
  /**
   * @method TODO
   */
  function customFormatNumber(value, formatToken) {
    var parts,
        separator = '.',
        separatorIdx = -1,
        result = '',
        integerFormat = '',
        fractionalFormat = '';
    
    separatorIdx = formatToken.indexOf(separator);
    
    if(separatorIdx >= 0){
      integerFormat = formatToken.substr(0, separatorIdx);
      fractionalFormat = formatToken.substr(separatorIdx+1);
    } else {
      integerFormat = formatToken;
    }
    
    parts = (value + '').split(separator);
    
    console.log('parts='+JSON.stringify(parts)+'; value='+value+'; format='+formatToken+
                '; intFormat='+integerFormat+'; fFormat='+fractionalFormat+'; sepIdx='+separatorIdx);
    
    if(parts.length === 2){
      result = formatIntegerPart(parts[0], integerFormat) + separator + formatFractionalPart(parts[1], fractionalFormat);
    } else {
      result = formatIntegerPart(value, integerFormat);
    }
    return result;
  }
  
  /**
   * @method Format integer part of a number using format token
   * @param {number} number Integer part of number to format
   * @param {string} mask Format token
   */
  function formatIntegerPart(number, mask) {
    var str = ''+number,
        i=0, 
        j=0,
        len = 0,
        digit = '',
        maskChar = '',
        result = [],
        emptyCount= 0,
        diff = 0;
    
    if(mask.length <= str.length){
      return number;
    }
    
    len = mask.length;
    diff = len - str.length;
    for(i=len-1, j=str.length-1; i>=0; i--, j--){
      digit = j >= 0 && j < str.length ? str.charAt(j) : null;
      maskChar = mask[i];
      
      switch(mask[i]){
        case '0':
          if(emptyCount > 0){
            for(var k = 0; k<emptyCount; k++){
              result.push('0');
            }
            emptyCount = 0;
          }
          result.push(digit === null ? '0' : digit);
          break;
        case '#':
          if(digit === null){
            emptyCount++;
          } else {
            result.push(digit);
          }
          break;
        default:
          j++;
          result.push(maskChar);
          break;
      }
//      console.log('d='+digit+'; mc='+maskChar+';res='+result);
    }
    
    return result.reverse().join('');
  }
  
  /**
   * @method Format fractional part of number
   * @param {number} number Fractional part of number
   * @param {string} mask Format token
   * @return {string}
   */
  function formatFractionalPart(number, mask){
    var str = ''+number;
    
    console.log('num='+number+'; mask='+mask+'; str='+str);
    var i=0, 
        j=0,
        len = 0,
        digit = '',
        maskChar = '',
        result = '',
        emptyCount = 0,
        diff = 0;   
    
//    if(mask.length <= str.length){
//      return number;
//    }
    
    for(i=0; i<mask.length; i++, j++){
      digit = str.length > j ? str.charAt(j) : null;
      maskChar = mask[i];
      switch(maskChar){
        case '0':
          if(emptyCount > 0){
            for(var k = 0; k<emptyCount; k++){
              result += '0';
            }
            emptyCount = 0;
          }
          result += digit === null ? '0' : digit;
          break;
        case '#':
          if(digit === null){
            emptyCount++;
          } else {
            result += digit;
          }
          break;
        default:
          if(maskChar !== '.'){
            result += maskChar;
          }
          j--;
          break;
      }
    }
    return result;
  }
  
  /**
   * @method TODO
   * @param {string} str String to align
   * @param {number} totalLength Number Length of resulting string
   * @param {number} alignment Number indicating the length of resulting string and alignment
   * @return {string} Aligned string
   */
  function alignString(str, totalLength, alignment){
    if(totalLength > str.length){
      if(alignment === ALIGN_LEFT){
        // Align left
        str = str + repeatStr(' ', totalLength - str.length);
      } else if (alignment === ALIGN_RIGHT) {
        // Align right
        str = repeatStr(' ', totalLength - str.length) + str;
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
  
  /**
   * @method Get absolute value
   * @param {Number} value Number
   * @return {Number} Absolute value of number
   */
  function abs (value){
    return value < 0 ? -1 * value : value;
  }
  
  /**
   * @method Get sign of a number
   * @param {Number} value Number
   * @return {Number} -1 if number is negative. 1 if number is 0 or positive number
   */
  function sign(value){
    return value < 0 ? -1 : 1;
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