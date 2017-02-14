//creating airport info index.js - entry point into skill service

'use strict';
//module change_code declaration enables live reloading of skill service when
//running locally as changes are made
module.change_code = 1;
var Alexa = require('alexa-app');
var skill = new Alexa.app('airport_info_do_over');
var FAADataHelper = require('./faa_data_helper');
var _ = require('lodash');

//onLaunch event handler-respond to onLaunch event from skill interface
var reprompt = 'I didn\'t hear an airport code: tell me an Airport code to get delay '
+ 'information for that airport.';
skill.launch(function(request, response) {
  var prompt = 'For delay information, tell me an Airport code.';
  response.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

// adding an Intent handler
skill.intent('airportInfoIntent', {
  'slots' : {
    'AIRPORTCODE' : 'FAACODES'
  },
  'utterances' : ['{|flight|airport} {|delay|status} {|info} {|for} {-|AIRPORTCODE}']
},
function(request, response) {
  var airportCode = request.slot('AIRPORTCODE');
  if (_.isEmpty(airportCode)) {
    var prompt = 'I didn\'t hear an airport code. Tell me an airport code.';
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    return true;
  }else {
  var faaDataHelper = new FAADataHelper();
  faaDataHelper.getAirportStatus(airportCode).then(function(airportStatus) {
    console.log(airportStatus);
    response.say(faaDataHelper.formatAirportStatus(airportStatus)).send();
  }).catch(function(err) {
    console.log(err.statusCode);
    var prompt = 'I didn\'t have data for an airport code of ' + airportCode;
    response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
  });
  return false;
}
}
);

//add airportWeatherIntent handler
skill.intent('airportWeatherIntent', {
  'slots': {
    'AIRPORTCODE': 'FAACODES'
  },
  'utterances': ['{|weather|conditions} {|temperature|wind} {-|AIRPORTCODE}']
},

function(request, response) {
  //2.18 Retrieving the slot value
  var airportCode = request.slot('AIRPORTCODE');
  //2.20 handling a failed response

  if(_.isEmpty(airportCode)) {
    var prompt = 'I didn\'t hear an airport code. Tell me an airport code.';
    reponse.say(prompt).reprompt(reprompt).shouldEndSession(false);
    return true;
  } else {
  var faaDataHelper = new FAADataHelper();
  faaDataHelper.getAirportStatus(airportCode).then(function(airportStatus) {
    console.log(airportStatus);
    response.say(faaDataHelper.formatAirportWeather(airportStatus)).send();
  }).catch(function(err) {
    console.log(err.statusCode);
    var prompt = 'I didn\'t have data for an airport code of ' + airportCode;
    response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();


  });
  return false;
}
}

);



module.exports = skill;
