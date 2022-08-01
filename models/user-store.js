'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const userStore = {

  store: new JsonStore('./models/user-store.json', { users: [] }),
  collection: 'users',

  getById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
};

module.exports = userStore;