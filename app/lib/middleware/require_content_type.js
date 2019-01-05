function requireContentType(aTypeRegexp) {
  return (req, res, next) => {
    let contentType = (req.headers && req.headers["content-type"]) || "";

    if (contentType.match(aTypeRegexp)) {
      next();
    } else {
      return res
        .status(415)
        .send({ message: res.__("errors.unsupported_media") });
    }
  };
}

module.exports = requireContentType;
