const DecoratedRouter = require("../lib/decorated_router");

function defineEndpoints({ mw, ctrlrs }) {
  let router = new DecoratedRouter();
  let setDefaultLocale = mw.defaultLocaleInfo({
    locale: "EN",
    countryCode: "US"
  });

  router.route("*").all(mw.requireContentType(/^application\/json/));

  router.route("/signup").post(setDefaultLocale, ctrlrs.Users.create);

  router.route("/token").post(ctrlrs.Users.getToken);

  return router;
}

module.exports = { defineEndpoints };
