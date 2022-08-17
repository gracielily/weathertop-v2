"use strict";
const account = require("./account.js");

const about = {
  index(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const viewData = {
      pageTitle: "About",
      user: user
    };
    response.render("about", viewData);
  }
};

module.exports = about;
