const UsersController = require("./users");
const RolesController = require("./roles");
const RoleAssignmentsController = require("./role_assignments");

function init() {
  return {
    Users: new UsersController(),
    Roles: new RolesController(),
    RoleAssignments: new RoleAssignmentsController()
  };
}

module.exports = {
  init,
  UsersController,
  RolesController,
  RoleAssignmentsController
};
