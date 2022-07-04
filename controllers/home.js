"use strict";

const home = {
  index(request, response) {
    const viewData = {
      pageTitle: "WeatherTop",
    };
    response.render("home", viewData);
  },
};

module.exports = home;
