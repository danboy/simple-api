const m = require("../../models");
const User = m.User;

function localActorByJwt({ includeRoles = false } = {}) {
  return (req, res, next) => {
    let searchCriteria = {
      where: { id: req.user.payload.user_id },
      include: []
    };

    if (includeRoles) {
      searchCriteria.include.push({ model: m.Role, as: "roles" });
    }

    return User.findOne(searchCriteria).then(user => {
      if (user) {
        res.locals.actor = user;
        next();
      } else {
        res.status(401);
        res.end();
      }
    });
  };
}

module.exports = localActorByJwt;
