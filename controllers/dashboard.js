"use strict";
const uuid = require("uuid");

const dashboard = {
  index(request, response) {
    const viewData = {
      pageTitle: "Dashboard",
      stations: [],
    };
    response.render("dashboard", viewData);
  },

};

module.exports = dashboard;
