const Auth = require("../services/auth");
const DecoratedRouter = require("../lib/decorated_router");

function defineEndpoints({ mw, ctrlrs }) {
  let router = new DecoratedRouter();

  router
    .route("*")
    .all(mw.requireContentType(/^application\/json/))
    .all(Auth.checkToken)
    .all(mw.localActorByJwt({ includeRoles: true }))
    .all(mw.requireActorRole("admin"));

  router
    .route("/roles")
    .get(ctrlrs.Roles.index)
    .post(ctrlrs.Roles.create);

  router
    .route("/roles/:slug")
    .get(
      mw.localRoleBySlug({ includeActor: true, loadUsers: true }),
      ctrlrs.Roles.show()
    )
    .put(mw.localRoleBySlug({ includeActor: true }), ctrlrs.Roles.update())
    .delete(mw.localRoleBySlug({ includeActor: true }), ctrlrs.Roles.delete());

  router
    .route("/roles/:roleSlug/users/:slug")
    .put(
      mw.localRoleBySlug({ attrName: "roleSlug" }),
      mw.localUserBySlug({ includeActor: true }),
      ctrlrs.RoleAssignments.create()
    )
    .delete(
      mw.localRoleBySlug({ attrName: "roleSlug" }),
      mw.localUserBySlug({ includeRoles: true }),
      ctrlrs.RoleAssignments.delete()
    );

  return router;
}

module.exports = { defineEndpoints };
