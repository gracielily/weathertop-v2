"use strict";

const express = require("express");
const logger = require("./utils/logger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cookieParser());
const exphbs = require("express-handlebars");

const isBetween = (val, min, max) => {
  return val >= min && val <= max;
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      last: (arr) => {
        return arr[arr.length - 1];
      },
      capitilize: (val) => {
        return val.charAt(0).toUpperCase() + val.slice(1);
      },
      weatherIcon: (val) => {
        const classMap = {
          100: "sun",
          200: "cloud sun",
          300: "cloud",
          400: "cloud sun rain",
          500: "cloud showers heavy rain",
          600: "cloud rain",
          700: "snowflake",
          800: "bolt",
        };
        return classMap[val] ? classMap[val] : "question";
      },
      tempIcon: (temp) => {
        if (temp > 18) {
          return "temperature red high";
        } else if (temp < 8) {
          return "temperature teal low";
        } else {
          return "thermometer";
        }
      },
      toBeaufort: (windSpeed) => {
        if (windSpeed == 1) {
          return "0 bft";
        } else if (isBetween(windSpeed, 1, 5)) {
          return "1 bft";
        } else if (isBetween(windSpeed, 6, 11)) {
          return "2 bft";
        } else if (isBetween(windSpeed, 12, 19)) {
          return "3 bft";
        } else if (isBetween(windSpeed, 20, 28)) {
          return "4 bft";
        } else if (isBetween(windSpeed, 29, 38)) {
          return "5 bft";
        } else if (isBetween(windSpeed, 39, 49)) {
          return "6 bft";
        } else if (isBetween(windSpeed, 50, 61)) {
          return "7 bft";
        } else if (isBetween(windSpeed, 62, 74)) {
          return "8 bft";
        } else if (isBetween(windSpeed, 75, 88)) {
          return "9 bft";
        } else if (isBetween(windSpeed, 89, 102)) {
          return "10 bft";
        } else if (isBetween(windSpeed, 103, 117)) {
          return "11 bft";
        }
        return "Unknown";
      },
      beaufortLabel: (beaufort) => {
        const labelMap = {
          "0 bft": "Calm",
          "1 bft": "Light Air",
          "2 bft": "Light Breeze",
          "3 bft": "Gentle Breeze",
          "4 bft": "Moderate Breeze",
          "5 bft": "Fresh Breeze",
          "6 bft": "Strong Breeze",
          "7 bft": "Near Gale",
          "8 bft": "Gale",
          "9 bft": "Severe Gale",
          "10 bft": "Strong Storm",
          "11 bft": "Violent Storm",
        };
        return labelMap[beaufort] ? labelMap[beaufort] : "Unknown";
      },
      windIcon: (windSpeed) => {
        if (isBetween(windSpeed, 50, 88)) {
          return "yellow wind";
        } else if (windSpeed > 88) {
          return "red wind";
        } else {
          return "wind";
        }
      },
      windCompass: (windDirection) => {
        if (360 - windDirection <= 11.25) {
          return "N";
        } else if (isBetween(windDirection, 11.25, 33.75)) {
          return "NNE";
        } else if (isBetween(windDirection, 33.75, 56.25)) {
          return "NE";
        } else if (isBetween(windDirection, 56.25, 78.75)) {
          return "ENE";
        } else if (isBetween(windDirection, 78.75, 101.25)) {
          return "E";
        } else if (isBetween(windDirection, 101.25, 123.75)) {
          return "ESE";
        } else if (isBetween(windDirection, 123.75, 146.25)) {
          return "SE";
        } else if (isBetween(windDirection, 146.25, 168.75)) {
          return "SSE";
        } else if (isBetween(windDirection, 168.75, 191.25)) {
          return "S";
        } else if (isBetween(windDirection, 191.25, 213.75)) {
          return "SSW";
        } else if (isBetween(windDirection, 213.75, 236.25)) {
          return "SW";
        } else if (isBetween(windDirection, 236.25, 258.75)) {
          return "WSW";
        } else if (isBetween(windDirection, 258.75, 281.25)) {
          return "W";
        } else if (isBetween(windDirection, 281.25, 303.75)) {
          return "WNW";
        } else if (isBetween(windDirection, 303.75, 326.25)) {
          return "NW";
        } else if (isBetween(windDirection, 326.25, 348.75)) {
          return "NNW";
        }
        return "Unknown";
      },
      windCompassLabel: (windCompass) => {
        let label = "";
        const compassMap = {
          N: "North",
          S: "South",
          E: "East",
          W: "West",
        };
        if (windCompass === "Unknown") {
          return "Unknown";
        }
        const windCompassLetters = windCompass.split("");
        windCompassLetters.map((letter) => {
          label += compassMap[letter] + " ";
        });
        return label.trim();
      },
      windChill: (temperature, windSpeed) => {
        return Math.floor(
            (13.2 + 0.6215 * temperature - 11.37 * Math.pow(windSpeed, 0.16) +
                0.3965 * temperature * Math.pow(windSpeed, 0.16)) * 10
        ) / 10;
      }
    },
  })
);
app.set("view engine", ".hbs");

const routes = require("./routes");
app.use("/", routes);

const listener = app.listen(process.env.PORT || 4000, function () {
  logger.info(`weathertop-v2 started on port ${listener.address().port}`);
});
