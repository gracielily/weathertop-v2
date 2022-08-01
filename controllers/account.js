"use strict";

const userstore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid");
const contextData = {
  pageTitle: "Login",
};

const accounts = {
  login(request, response) {
    response.render("login", contextData);
  },

  logout(request, response) {
    response.cookie("user", "");
    response.redirect("/");
  },

  authenticate(request, response) {
    const user = userstore.getByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie("user", user.email);
      response.redirect("/dashboard");
    } else {
      const errorContextData = {...contextData}
      errorContextData.error = "Invalid Credentials. Please try again.";
      response.render("login", errorContextData);
    }
  },

  getLoggedInUserOrRedirect(request, response) {
    const user = userstore.getByEmail(request.cookies.user);
    if (!user) {
      response.redirect("/login")
    }
    return user;
  },
};

module.exports = accounts;
