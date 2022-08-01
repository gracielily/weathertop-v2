"use strict";
const account = require("./account.js");

const about = {
  index(request, response) {
    account.getLoggedInUserOrRedirect(request, response);
    const viewData = {
      pageTitle: "About",
    };
    response.render("about", viewData);
  },
};

module.exports = about;
