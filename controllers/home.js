"use strict";
const account = require("./account.js");

const home = {
  index(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const contextData = {
      pageTitle: "WeatherTop",
      user: user,
    };
    response.render("home", contextData);
  },
};

module.exports = home;
