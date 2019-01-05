const mediaAttributes = [
  "slug",
  "description",
  "source_url",
  "duration",
  "type"
];
const teamMemberAttributes = [
  "slug",
  "full_name",
  "role",
  "status",
  "email",
  "bio"
];
const ventureAttributes = [
  "slug",
  "name",
  "overview",
  "jurisdiction",
  "vertical",
  "industry",
  "status",
  "phone",
  "email",
  "logo_url",
  "website_url"
];

function present(item, type = "venture", mediaToPlay = {}) {
  if (type !== "venture")
    throw new Error(`no presenter written for type "${type}"`);

  if (item.map) {
    return item.map(i => {
      return formatVenture(i, mediaToPlay);
    });
  } else {
    return formatVenture(item, mediaToPlay);
  }
}

function formatVenture(venture, mediaToPlay) {
  if (!venture) return {};

  let plain = venture.get({ plain: true });
  let forResponse = {};

  ventureAttributes.forEach(attrName => {
    forResponse[attrName] = plain[attrName];
  });

  if (venture.currentPitchVideo) {
    forResponse.current_pitch_video = formatMediaItem(
      venture.currentPitchVideo
    );
  }

  if (venture.tags) {
    forResponse.tags = venture.tags.map(tag => {
      return { name: tag.name };
    });
  }

  if (venture.media) {
    forResponse.media = venture.media.map(mediaItem => {
      return formatMediaItem(mediaItem);
    });
  }

  if (venture.teamMembers) {
    forResponse.team_members = venture.teamMembers.map(teamMember => {
      return presentTeamMember(teamMember, venture.slug);
    });
  }

  if (mediaToPlay) {
    forResponse.media_to_play = formatMediaItem(mediaToPlay);
  } else {
    forResponse.media_to_play = formatMediaItem(venture.currentPitchVideo);
  }

  // venture.following may be false in the future,
  // so we verify if its defined so we can include false if the venture is not followed
  if (typeof venture.following !== "undefined") {
    forResponse.following = venture.following;
  }

  forResponse.links = {
    retrieve_venture: {
      url: `/ventures/${venture.slug}`,
      method: "GET"
    },
    update_venture: {
      url: `/ventures/${venture.slug}`,
      method: "PUT"
    },
    generate_media_upload_request: {
      url: `/ventures/${venture.slug}/media-upload-request`,
      method: "POST"
    },
    add_team_member: {
      url: `/ventures/${venture.slug}/team-members`,
      method: "POST"
    },
    list_team_members: {
      url: `/ventures/${venture.slug}/team-members`,
      method: "GET"
    }
  };
  return forResponse;
}

function formatMediaItem(mediaItem) {
  let formatted = {};

  mediaAttributes.forEach(attrName => {
    formatted[attrName] = mediaItem[attrName];
  });

  if (mediaItem.transcoding_info) {
    formatted.transcoding_info = mediaItem.transcoding_info;
  }

  if (mediaItem.act) {
    formatted.act = mediaItem.act;
  }

  formatted.links = {
    like_media: {
      url: `/media/${mediaItem.slug}/like`,
      method: "PUT"
    },
    dislike_media: {
      url: `/media/${mediaItem.slug}/dislike`,
      method: "PUT"
    }
  };

  return formatted;
}

function presentTeamMember(teamMember, ventureSlug) {
  let formatted = {};

  teamMemberAttributes.forEach(attrName => {
    formatted[attrName] = teamMember[attrName];
  });

  formatted.links = {
    retrieve_team_member: {
      url: `/ventures/${ventureSlug}/team-members/${teamMember.slug}`,
      method: "GET"
    },
    update_team_member: {
      url: `/ventures/${ventureSlug}/team-members/${teamMember.slug}`,
      method: "PUT"
    },
    remove_team_member: {
      url: `/ventures/${ventureSlug}/team-members/${teamMember.slug}`,
      method: "DELETE"
    },
    retrieve_venture: {
      url: `/ventures/${ventureSlug}`,
      method: "GET"
    }
  };

  return formatted;
}

function presentTeamMembers(teamMembers, ventureSlug) {
  return teamMembers.map(tm => {
    return presentTeamMember(tm, ventureSlug);
  });
}

module.exports = { present, presentTeamMember, presentTeamMembers };
