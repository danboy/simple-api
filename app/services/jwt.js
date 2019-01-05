var jwt = require("jsonwebtoken");
const fs = require("fs");

const key = {
  private: process.env.PRIVATE_KEY,
  public: process.env.PUBLIC_KEY
};

module.exports = {
  sign: (payload, $options) => {
    var options = {
      issuer: $options.issuer,
      subject: $options.subject,
      audience: $options.audience,
      expiresIn: process.env.TOKEN_EXP,
      algorithm: process.env.ALGO
    };
    return jwt.sign(payload, key.private, options);
  },
  verify: (token, $options) => {
    const options = {
      issuer: process.env.ISSUER,
      expiresIn: process.env.TOKEN_EXP,
      algorithms: [process.env.ALGO]
    };
    try {
      return jwt.verify(token, key.public, options);
    } catch (err) {
      return false;
    }
  },
  decode: token => {
    return jwt.decode(token, { complete: true });
  }
};
