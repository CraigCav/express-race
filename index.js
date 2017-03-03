module.exports = function race(...middlewares) {
  middlewares = middlewares.filter(function (fn) { return !!fn; });

  return function compositeMiddleware(req, res, next) {
    var remaining = middlewares.length;
    var done = false;

    function finish(err) {
      done = true;
      next(err);
    }

    middlewares.forEach(function(middleware) {

      setImmediate(function() {
        middleware(req, res, function(err) {
          if(done) return;
          if(!err) return finish();
          remaining -= 1;
          if (remaining === 0) return finish(err);
        });
      });
    });
  };
};