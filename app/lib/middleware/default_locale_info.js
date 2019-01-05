/**
 * Middleware to set a default `locale` & `countryCode` on
 * the request body if they do not already exist. If the request
 * contains the parameters, they will not be overridden.
 *
 * Params: Object containing the following attributes
 *   locale: a string for the default locale to set
 *   countryCode: a string for the default country code to set
 *
 * Returns piece of middleware ready to be injected into router.
 */
function defaultLocaleInfo({ locale, countryCode }) {
  return (req, res, next) => {
    if (req.body && !(req.body.countryCode && req.body.locale)) {
      req.body.locale = locale;
      req.body.countryCode = countryCode;
    }
    next();
  };
}

module.exports = defaultLocaleInfo;
