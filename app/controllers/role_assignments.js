const m = require("../models");

class RoleAssignmentsController {
  create(options = {}) {
    return (req, res, next) => {
      let { user, actor, role } = res.locals;
      let searchCriteria = { user_id: user.id, role_id: role.id };

      return m.RoleAssignment.findOrCreate({
        where: searchCriteria,
        defaults: { actor_id: actor.id }
      }).then(r => {
        if (r.isNewRecord) {
          res.sendStatus(422);
        } else {
          res.sendStatus(204);
        }
      });
    };
  }

  delete(options = {}) {
    return (req, res, next) => {
      let { user, role } = res.locals;
      let raInfo = { user_id: user.id, role_id: role.id };

      return m.RoleAssignment.destroy({ where: raInfo }).then(r => {
        res.sendStatus(204);
      });
    };
  }
}

module.exports = RoleAssignmentsController;
