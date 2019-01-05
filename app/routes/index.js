const mw = require("../lib/middleware");
const ctrlrs = require("../controllers").init();
const { defineEndpoints: defineAdminEndpoints } = require("./admin");
const {
  defineEndpoints: defineUnauthenticatedEndpoints
} = require("./unauthenticated");
const {
  defineEndpoints: defineStandardUserEndpoints
} = require("./standard_user");

let unauthenticatedRouter = defineUnauthenticatedEndpoints({ mw, ctrlrs });
let adminRouter = defineAdminEndpoints({ mw, ctrlrs });
let standardUserRouter = defineStandardUserEndpoints({ mw, ctrlrs });

module.exports = { adminRouter, standardUserRouter, unauthenticatedRouter };
