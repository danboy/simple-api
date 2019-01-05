const Router = require("express").Router;

class DecoratedRouter {
  constructor() {
    this.router = Router();
    this._meta = {};
    this.routeOnDeck = undefined;
  }

  route(pathDef) {
    try {
      if (this.routeOnDeck) {
        this.routeOnDeck.url = pathDef;
        this._meta[pathDef] = this.routeOnDeck;
        this.routeOnDeck = undefined;
      }
    } catch (e) {
      this.routeOnDeck = undefined;
    }

    return this.router.route(pathDef);
  }

  use(mw, args) {
    return this.router.use(mw, args);
  }

  core() {
    return this.router;
  }

  docs(name, info) {
    this.routeOnDeck = { name, ...info };
    return this;
  }

  getMetaFor(path) {
    return this._meta[path];
  }

  generateLanding() {
    let cachedDocs;

    return (req, res, next) => {
      if (cachedDocs) {
        res.send(cachedDocs);
      } else {
        cachedDocs = generateRouterDocs(this);
        res.send(cachedDocs);
      }
    };
  }

  get stack() {
    return this.router.stack;
  }
}

function generateRouterDocs(router) {
  return router.stack.reduce(
    (docs, routeDef) => {
      let path = routeDef.route.path;
      let meta = router.getMetaFor(path) || {};
      let name = meta.name;
      let method = routeDef.route.stack && routeDef.route.stack[0].method;

      if (method) method = method.toUpperCase();

      if (typeof name !== "undefined") {
        docs.links[name] = { ...meta, method };
      }

      return docs;
    },
    { links: {} }
  );
}

module.exports = DecoratedRouter;
