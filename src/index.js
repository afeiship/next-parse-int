(function () {
  var global = typeof window !== 'undefined' ? window : this || Function('return this')();
  var nx = global.nx || require('@jswork/next');
  var UNDEF = 'undefined';

  nx.parseInt = function (inNumeric, inRadix) {
    var radix = typeof inRadix === UNDEF ? inRadix : 10;
    var parsed = parseInt(inNumeric, radix);
    if (isNaN(parsed)) return inNumeric;
    return parsed;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = nx.parseInt;
  }
})();
