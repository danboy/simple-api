if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const Auth = require("../services/auth");
const BaseController = require("./base");

class UserController extends BaseController {
  constructor() {
    super("User");
  }

  getToken(req, res) {
    Auth.checkUser(req, function(err, user) {
      if (err) return res.status(401).send({ error: err });
      Auth.getToken(
        {
          user_id: user.id,
          issuer: process.env.ISSUER,
          subject: user.email,
          audience: req.body.audience
        },
        function(token) {
          res.send({ token: token });
        }
      );
    });
  }
}

module.exports = UserController;
