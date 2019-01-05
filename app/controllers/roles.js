const BaseController = require("./base");
const { presenter } = require("../lib/presenters/role");

class RolesController extends BaseController {
  constructor() {
    super("Role", { singularized: "role", pluralized: "tags", presenter });
  }

  create(req, res, next) {
    req.body.actor_id = res.locals.actor.id;

    this.model
      .create(req.body, {
        include: this.associations
      })
      .then(result => {
        result.actor = res.locals.actor;
        res.status(201).send({ [this.singularizedModel]: presenter(result) });
      })
      .catch(err => {
        next(err);
      });
  }

  update(options = {}) {
    return (req, res, next) => {
      let role = res.locals.role;

      if (role.isAdmin()) {
        return res.status(403).send({ message: res.__("errors.bad_request") });
      } else {
        return role.update(req.body).then(r => {
          res.status(200).send({ role: presenter(r) });
        });
      }
    };
  }

  delete(options = {}) {
    return (req, res, next) => {
      let role = res.locals.role;

      if (role.isAdmin()) {
        return res.status(403).send({ message: res.__("errors.bad_request") });
      } else {
        return role.destroy().then(r => {
          res.status(204).send();
        });
      }
    };
  }

  show(options = {}) {
    return (req, res, next) => {
      res.send({ role: presenter(res.locals.role) });
    };
  }
}

module.exports = RolesController;
