const converters = require("./converters.js");

const isBetween = (val, min, max) => {
  return val >= min && val <= max;
};

const register = function (Handlebars) {
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
    // formatTimestamp: (timestampString) => {
    //   const date = new Date(timestampString);
    //   // server uses UTC so need to convert to irish timezone
    //   const displayDate = date
    //     .toLocaleString("en-US", { timeZone: "Europe/Dublin", hour12: false })
    //     .split(", ");
    //   return displayDate[0] + " " + displayDate[1];
    // },
    toJson: (obj) => {
      return JSON.stringify(obj);
    },
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    return helpers;
  }
};

module.exports.register = register;
module.exports.helpers = register(null);
