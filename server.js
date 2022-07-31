"use strict";

const express = require("express");
const logger = require("./utils/logger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cookieParser());
const exphbs = require("express-handlebars");

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
          800: "bolt"
        }
        return classMap[val] ? classMap[val] : "question";
      },
      tempIcon: (temp) => {
        if(temp > 18){
          return "temperature red high";
        }
        else if(temp < 8){
          return "temperature teal low";
        }
        else {
          return "thermometer";
        }
      },
      toBeaufort: (windSpeed) => {
           if (windSpeed == 1) {
      return "0 bft";
    } else if (windSpeed > 1 && windSpeed <= 5) {
      return "1 bft";
    } else if (windSpeed >= 6 && windSpeed <= 11) {
      return "2 bft";
    } else if (windSpeed >= 12 && windSpeed <= 19) {
      return "3 bft";
    } else if (windSpeed >= 20 && windSpeed <= 28) {
      return "4 bft";
    } else if (windSpeed >= 29 && windSpeed <= 38) {
      return "5 bft";
    } else if (windSpeed >= 39 && windSpeed <= 49) {
      return "6 bft";
    } else if (windSpeed >= 50 && windSpeed <= 61) {
      return "7 bft";
    } else if (windSpeed >= 62 && windSpeed <= 74) {
      return "8 bft";
    } else if (windSpeed >= 75 && windSpeed <= 88) {
      return "9 bft";
    } else if (windSpeed >= 89 && windSpeed <= 102) {
      return "10 bft";
    } else if (windSpeed >= 103 && windSpeed <= 117) {
      return "11 bft";
    }
    return "Unknown";
  } ,
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
        }
        return labelMap[beaufort] ? labelMap[beaufort] : "Unknown";
      },
      windIcon: (windSpeed) => {
         if(windSpeed >= 50 && windSpeed <= 88){
              return "yellow wind";
         }
        else if(windSpeed > 88){
          return "red wind";
        }
        else {
          return "wind";
        }
      }
    }
  })
);
app.set("view engine", ".hbs");

const routes = require("./routes");
app.use("/", routes);

const listener = app.listen(process.env.PORT || 4000, function() {
  logger.info(`weathertop-v2 started on port ${listener.address().port}`);
});
