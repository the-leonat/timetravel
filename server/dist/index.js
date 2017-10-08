"use strict";

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _googleDistanceMatrix = require("google-distance-matrix");

var _googleDistanceMatrix2 = _interopRequireDefault(_googleDistanceMatrix);

var _jsonfile = require("jsonfile");

var _jsonfile2 = _interopRequireDefault(_jsonfile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiKey = "AIzaSyD5itzQ3zqnfTO9qrLQRfvGS3slIHFrokU";
var apiKey2 = "AIzaSyASrDgBiQJiZYiBA9a4Cur2jQR_flJW-uk";
var cityFile = "cities.json";
var directionFile = "directions.json";

//set api key
_googleDistanceMatrix2.default.key(apiKey2);
_googleDistanceMatrix2.default.language("de");

//set request time
var requestDate = new Date();

var d1 = new Date();
d1.setDate(d1.getDate() + 3);
d1.setHours(10, 0, 0, 0);

var d2 = new Date();
d2.setHours(0, 0, 0, 0);

var requestList = [];

var timing = 0;

var departureTimes = [d1];

var transportModes = ["driving", "transit"];

_fs2.default.readFile("./" + cityFile, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  var directions = [];

  var d = JSON.parse(data);

  //two sample cities
  //d = [d[0], d[1]]

  d.forEach(function (origin) {
    var filteredDestinations = d.filter(function (refCity, index) {
      return origin.City !== refCity.City;
    });

    var cityToCities = {
      //overwritten later by api
      origin: origin.City,
      lat: origin.Latitude,
      long: origin.Longitude,
      population: origin.Population,
      destinations: []
    };
    directions.push(cityToCities);

    filteredDestinations.forEach(function (destination) {

      var cityToCity = {
        //overwritten later by api 
        destination: destination.City,
        directions: []
      };
      cityToCities.destinations.push(cityToCity);

      departureTimes.forEach(function (time, timeIndex) {
        transportModes.forEach(function (mode, modeIndex) {
          requestList.push(requestDistance(origin.City, destination.City, time.getTime() / 1000, mode).then(function (resp) {
            var e = resp.rows[0].elements[0];
            console.log(e);

            cityToCities.origin = resp.origin_addresses[0];
            cityToCity.destination = resp.destination_addresses[0];

            var directionObject = {
              modeIndex: modeIndex,
              travelTime: e.duration.value,
              travelDistance: e.distance.value,
              departureIndex: timeIndex,
              hour: time.getHours(),
              apiResponse: resp
            };

            if (e.duration_in_traffic !== undefined) {
              directionObject["duration_in_traffic"] = e.duration_in_traffic.value;
            }

            cityToCity.directions.push(directionObject);
          }, function (err) {
            console.error("rejected");
            console.error(err);
          }));
        });
      });
    });
  });

  Promise.all(requestList).then(function () {
    _jsonfile2.default.writeFile("./" + directionFile, {
      countryLabel: "DEU",
      departureTimes: departureTimes,
      transportModes: transportModes,
      directions: directions
    }, function (err) {
      if (!err) return;

      console.log("error");
      console.error(err);
    });
  });
});

function requestDistance(origin, destination, departureTime, transportMode) {
  timing += 1;
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      _googleDistanceMatrix2.default.departure_time(departureTime);
      _googleDistanceMatrix2.default.mode(transportMode);

      console.log("TRY: " + origin + " -> " + destination);

      _googleDistanceMatrix2.default.matrix([origin], [destination], function (err, response) {
        if (err || response.status != "OK") {
          console.log("ERR: " + origin + " -> " + destination);
          console.log(response);
          reject(err);
          return;
        } else {
          console.log("SUC: " + origin + " -> " + destination);

          resolve(response);
        }
      });
    }, timing * (1000 / 40));
  });
}