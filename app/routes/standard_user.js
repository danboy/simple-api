const Auth = require("../services/auth");
const DecoratedRouter = require("../lib/decorated_router");

function defineEndpoints({ mw, ctrlrs }) {
  let router = new DecoratedRouter();

  router
    .route("*")
    .all(mw.requireContentType(/^application\/json/))
    .all(Auth.checkToken);

  router
    .docs("landing", { summary: "Root endpoint of API." })
    .route("/")
    .get(mw.localActorByJwt(), router.generateLanding(router));

  return router;
}

module.exports = { defineEndpoints };
