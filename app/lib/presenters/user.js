function presenter(oneOrMore) {
  return oneOrMore.map ? presentUsers(oneOrMore) : presentUser(oneOrMore);
}

function presentUser(p) {
  if (!p) {
    return {};
  }

  return {
    slug: p.slug,
    full_name: p.full_name
  };
}

function presentUsers(users) {
  return users.map(p => {
    return presentUser(p);
  });
}

module.exports = { presentUser, presentUsers, presenter };
