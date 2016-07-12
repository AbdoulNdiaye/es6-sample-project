const hooks = require('hooks');

hooks.beforeEach(function (test, done) {
  test.request.headers = {
    "content-type": "application/json"
  };

  done();
});

hooks.before('GET / -> 200', function (test, done) {
  done();
});

hooks.before('GET /404 -> 404', function (test, done) {
  done();
});

hooks.before('GET /error -> 500', function (test, done) {
  done();
});
