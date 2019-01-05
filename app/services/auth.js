var jwt = require("./jwt");
const User = require("../models").User;

var self = {
  checkUser: function(req, cb) {
    // TODO: Add a scope for users categorized as "user" in our domain model
    User.findOne({
      where: { email: req.body.email }
    }).then(function(user, er) {
      if (!user) {
        // TODO: Swap to return an Error object but want to test...after model/schema updates
        return cb({ message: req.__("errors.authentication") }); // eslint-disable-line standard/no-callback-literal
      } else if (user) {
        user.authenticate(req.body.password, function(err, result) {
          // TODO: Swap to return an Error object but want to test...after model/schema updates
          if (err || !user)
            return cb({ message: req.__("errors.authentication") }); // eslint-disable-line standard/no-callback-literal
          return cb(null, user);
        });
      }
    });
  },

  getToken: function(options, cb) {
    let token = jwt.sign(
      {
        user_id: options.user_id
      },
      {
        issuer: options.issuer,
        subject: options.subject,
        audience: options.audience
      }
    );

    return cb ? cb(token) : Promise.resolve(token);
  },

  checkToken: function(req, res, next) {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "JWT"
    ) {
      let token = req.headers.authorization.split(" ")[1];
      if (jwt.verify(token, { algorithms: [process.env.ALGO] })) {
        req.user = jwt.decode(token, { complete: true });
        next();
      } else {
        return res.status(401).send({ message: res.__("errors.unauthorized") });
      }
    } else {
      req.user = undefined;
      return res.status(401).send({ message: res.__("errors.unauthorized") });
    }
  }
};

module.exports = self;
