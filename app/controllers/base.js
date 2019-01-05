const Models = require("../models");

class BaseController {
  constructor(name, options = {}) {
    this.name = name;
    this.singularizedModel = options.singularizedModel || name.toLowerCase();
    this.pluralizedModel =
      options.pluralizedModel || `${this.singularizedModel}s`;
    this.instanceSearchAttribute = options.instanceSearchAttribute || "id";
    this.model = Models[name];
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.associations = [];
    this.presenter = options.presenter;
  }

  index(req, res, next) {
    let limit = req.query.limit || 25;

    this.model
      .findAll({ limit: limit, include: this.associations })
      .then(items => {
        items = this.presenter ? this.presenter(items) : items;

        res.send({ [this.pluralizedModel]: items });
      })
      .catch(err => {
        next(err);
      });
  }

  show(req, res, next) {
    let findArgs = {
      where: { [this.instanceSearchAttribute]: req.params.id },
      include: this.associations
    };

    this.model
      .findOne(findArgs)
      .then(item => {
        res.send({ [this.singularizedModel]: item });
      })
      .catch(err => {
        next(err);
      });
  }

  create(req, res, next) {
    this.model
      .create(req.body, {
        include: this.associations
      })
      .then(result => {
        res.status(201).send({ [this.singularizedModel]: result });
      })
      .catch(err => {
        next(err);
      });
  }

  update(req, res, next) {
    this.model
      .update(req.body, {
        where: { [this.instanceSearchAttribute]: req.params.id }
      })
      .then(result => {
        res.send({ [this.singularizedModel]: result });
      })
      .catch(err => {
        next(err);
      });
  }

  delete(req, res, next) {
    this.model
      .destroy({ where: { [this.instanceSearchAttribute]: req.params.id } })
      .then(result => {
        res.send({ [this.singularizedModel]: result });
      })
      .catch(err => {
        next(err);
      });
  }

  modify(req, res) {}

  async _asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}

module.exports = BaseController;
