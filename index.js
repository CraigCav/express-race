module.exports = function race(...middlewares) {
  middlewares = middlewares.filter(function (fn) { return !!fn; });

  return function compositeMiddleware(req, res, next) {
    var remaining = middlewares.length;

    middlewares.forEach(function(middleware) {
      var done = false;

      setImmediate(function() {
        var once = true;

        middleware(req, res, function(err) {
          if(done) return;
          done = true;

          if(!err) return next();

          remaining -= 1;
          // every middleware function ended in error
          if (remaining === 0) return next(err);
        });
      });
    });
  };
};