const { presentUser, presentUsers } = require("./user");

function presenter(oneOrMore) {
  return oneOrMore.map ? presentRoles(oneOrMore) : presentRole(oneOrMore);
}

function presentRole(role) {
  if (!role) {
    return {};
  }

  return {
    slug: role.slug,
    name: role.name,
    description: role.description,
    creator: role.actor ? presentUser(role.actor) : undefined,
    users: role.users ? presentUsers(role.users) : undefined,
    links: {
      self: {
        url: `/admin/roles/${role.slug}`,
        docs:
          "https://thecrowd.postman.co/collections/41787-795ce0cc-6ff1-4024-b746-7b2e4a7518cb?workspace=cd5aebb3-c046-47f6-808f-8df7a06f7473#a809a76a-cfad-4d85-8cc1-f8648ab29e15"
      },
      delete_role: {
        url: `/admin/roles/${role.slug}/users/:csv-of-users-slugs`,
        docs:
          "https://thecrowd.postman.co/collections/41787-795ce0cc-6ff1-4024-b746-7b2e4a7518cb?workspace=cd5aebb3-c046-47f6-808f-8df7a06f7473#249b7cf6-640b-4a4a-bf2a-2e965ee5fd80"
      },
      update_role: {
        url: `/admin/roles/${role.slug}`,
        docs:
          "https://thecrowd.postman.co/collections/41787-795ce0cc-6ff1-4024-b746-7b2e4a7518cb?workspace=cd5aebb3-c046-47f6-808f-8df7a06f7473#1ad9e722-7703-48a5-b84a-8b5a0107ab6f"
      },
      list_roles: {
        url: `/admin/roles`,
        docs:
          "https://thecrowd.postman.co/collections/41787-795ce0cc-6ff1-4024-b746-7b2e4a7518cb?workspace=cd5aebb3-c046-47f6-808f-8df7a06f7473#1df42aac-522d-47a6-811e-878be0047186"
      },
      create_role: {
        url: `/admin/roles`,
        docs:
          "https://thecrowd.postman.co/collections/41787-795ce0cc-6ff1-4024-b746-7b2e4a7518cb?workspace=cd5aebb3-c046-47f6-808f-8df7a06f7473#b8318ce0-8bf2-4920-86c1-c4ef755e2cba"
      },
      assign_user_role: {
        url: `/admin/roles/${role.slug}/users/:user-slug`,
        docs:
          "https://thecrowd.postman.co/collections/41787-795ce0cc-6ff1-4024-b746-7b2e4a7518cb?workspace=cd5aebb3-c046-47f6-808f-8df7a06f7473#e1cddb70-3807-4f14-90bc-9129f8eeeeff"
      },
      revoke_user_role: {
        url: `/admin/roles/${role.slug}/users/:csv-of-users-slugs`,
        docs:
          "https://thecrowd.postman.co/collections/41787-795ce0cc-6ff1-4024-b746-7b2e4a7518cb?workspace=cd5aebb3-c046-47f6-808f-8df7a06f7473#3f8caef7-c947-4935-961e-49c22ba96026"
      }
    }
  };
}

function presentRoles(roles) {
  return roles.map(r => {
    return presentRole(r);
  });
}

module.exports = { presentRole, presentRoles, presenter };
