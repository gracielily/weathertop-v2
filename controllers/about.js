"use strict";

const about = {
  index(request, response) {
    const viewData = {
      pageTitle: "About",
    };
    response.render("about", viewData);
  },
};

module.exports = about;
