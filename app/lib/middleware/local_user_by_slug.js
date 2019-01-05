const m = require("../../models");
const User = m.User;

function localUserBySlug({ includeRoles = false, attrName = "slug" } = {}) {
  return (req, res, next) => {
    let searchCriteria = { where: { slug: req.params[attrName] }, include: [] };

    if (includeRoles) {
      searchCriteria.include.push({ model: m.Role, as: "roles" });
    }

    return User.findOne(searchCriteria).then(user => {
      if (user) {
        res.locals.user = user;
        next();
      } else {
        res.status(404);
        res.end();
      }
    });
  };
}

module.exports = localUserBySlug;
