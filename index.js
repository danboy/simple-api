if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const i18n = require("i18n");

var {
  standardUserRouter,
  adminRouter,
  unauthenticatedRouter
} = require("./app/routes");

var app = express();

i18n.configure({
  locales: ["en"],
  directory: path.join(__dirname, "config/locales"),
  objectNotation: true
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  }
  next();
});

app.use(i18n.init);

app.use(require("morgan")("combined", { stream: { write: console.log } }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", unauthenticatedRouter.core());
app.use("/", standardUserRouter.core());
app.use("/admin", adminRouter.core());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = app;
