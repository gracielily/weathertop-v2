"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const userStore = {
  store: new JsonStore("./models/user-store.json", { users: [] }),
  collection: "users",

  addUser(user) {
    if (this.getByEmail(user.email)) {
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

  updateUser(currentUser, updatedUser) {
    const userWithEmail = this.getByEmail(updatedUser.email)
    if(userWithEmail && userWithEmail.id !== currentUser.id){
      throw "Email " + userWithEmail.email + " already in use";
    }
    currentUser.firstName = updatedUser.firstName;
    currentUser.lastName = updatedUser.lastName;
    currentUser.email = updatedUser.email;
    currentUser.password = updatedUser.password;
    this.store.save();
  },
};

module.exports = userStore;
