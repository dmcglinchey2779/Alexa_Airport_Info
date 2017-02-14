//Alexa Skill Airport Info data helper
'use strict';
var _ = require('lodash');
var requestPromise = require('request-promise');
var ENDPOINT = 'http://services.faa.gov/airport/status/';

function FAADataHelper() {

}
FAADataHelper.prototype.getAirportStatus = function(airportCode) {
  var options = {
    method: 'GET',
    uri: ENDPOINT + airportCode,
    json: true
  };
  return requestPromise(options);
};
//lodash string _.template function - ES template literals
FAADataHelper.prototype.formatAirportStatus = function(airportStatusObject) {
  if (airportStatusObject.delay === 'true') {
    var template = _.template('There is currently a delay for ${airport}. ' +
  'The average delay time is ${delay_time}.' +
  'The reason for the delay is ${reason}.');
  return template({
    airport: airportStatusObject.name,
    delay_time: airportStatusObject.status.avgDelay,
    reason: airportStatusObject.status.reason
  });
} else {
  //no delay
  var template = _.template('There is currently no delay at ${airport}.');
  return template({airport: airportStatusObject.name});
}
};

FAADataHelper.prototype.formatAirportWeather = function(airportStatusObject) {
  var template = _.template('Local weather conditions at ${airport} are as follows: ' +
'the weather is ${weather}. The temperature is ${temp}.' +
'The wind is: ${wind}.');
return template({
  airport: airportStatusObject.name,
  weather: airportStatusObject.weather.weather,
  temp: airportStatusObject.weather.temp,
  wind: airportStatusObject.weather.wind
});
};

module.exports = FAADataHelper;
