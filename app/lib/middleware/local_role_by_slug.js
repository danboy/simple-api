const m = require("../../models");
const Role = m.Role;

function localRoleBySlug({
  attrName = "slug",
  includeActor = false,
  includeUsers = true
} = {}) {
  let searchCriteria = { include: [] };

  if (includeActor) {
    searchCriteria.include.push({ model: m.User, as: "actor" });
  }

  if (includeUsers) {
    searchCriteria.include.push({ model: m.User, as: "users" });
  }

  return (req, res, next) => {
    searchCriteria.where = { slug: req.params[attrName] };

    return Role.findOne(searchCriteria).then(r => {
      if (r) {
        res.locals.role = r;
        next();
      } else {
        res.status(404);
        res.end();
      }
    });
  };
}

module.exports = localRoleBySlug;
