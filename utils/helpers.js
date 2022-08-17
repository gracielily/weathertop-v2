const converters = require("./converters.js");

const register = function(Handlebars) {
  const helpers = {
    last: (arr) => {
      return arr[arr.length - 1];
    },
    capitilize: (val) => {
      if (val) {
        return val.charAt(0).toUpperCase() + val.slice(1);
      }
    },
    toFixed: (value) => {
      return value.toFixed(3);
    },
    toJson: (obj) => {
      return JSON.stringify(obj);
    }
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (const prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    return helpers;
  }
};

module.exports.register = register;
module.exports.helpers = register(null);
