var http = require("http"),
    stream = require("stream"),
    url = require("url");

var SuckThrough = module.exports = function SuckThrough(options) {
  options = options || {};

  stream.Transform.call(this);

  this._url = options.url;
};
SuckThrough.prototype = Object.create(stream.Transform.prototype);

SuckThrough.prototype._transform = function _transform(input, encoding, done) {
  var self = this;

  var options = url.parse(this._url);

  options.method = "POST";

  var req = http.request(options, function(res) {
    res.on("error", done);

    res.resume();

    res.on("end", function() {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return done(Error("invalid status code; expected 2xx but got " + res.statusCode));
      }

      self.push(input);

      return done();
    });
  });

  req.on("error", done);

  return req.end(input);
};
