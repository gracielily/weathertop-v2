'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const userStore = {

  store: new JsonStore('./models/user-store.json', { users: [] }),
  collection: 'users',

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    if(this.getByEmail(user.email)){
      throw "User already exists";
    }
    this.store.add(this.collection, user);
    this.store.save();
  },

  getById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },
};

module.exports = userStore;