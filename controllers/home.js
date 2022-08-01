"use strict";
const account = require("./account.js");

const home = {
  index(request, response) {
    account.getLoggedInUserOrRedirect(request, response);
    const contextData = {
      pageTitle: "WeatherTop",
    };
    response.render("home", contextData);
  },
};

module.exports = home;
