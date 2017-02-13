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

module.exports = FAADataHelper;
