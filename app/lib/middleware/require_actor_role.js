function requireActorRole(role) {
  return (req, res, next) => {
    let actor = res.locals.actor;

    if (hasRole(actor, role)) {
      next();
    } else {
      return res.status(401).send({ message: res.__("errors.unauthorized") });
    }
  };
}

function hasRole(actor = {}, role) {
  return (
    actor.roles &&
    actor.roles.find(r => {
      return r.slug === role;
    })
  );
}

module.exports = requireActorRole;
