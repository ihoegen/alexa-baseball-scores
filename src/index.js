'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var SKILL_NAME = 'Baseball Scores';
var teams = require('./teams');
var mlb = require('./mlb');


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'NewSession': function () {
        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + '. You can ask a question like, what\'s the' +
            ' score of the Mariner\'s game? ... Now, what can I help you with.';
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = 'For instructions on what you can say, please say help me.';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'ScoresIntent': function () {
        var teamSlot = this.event.request.intent.slots.Team;
        var teamName;
        if (teamSlot && teamSlot.value) {
            teamName = teamSlot.value.toLowerCase();
        }

        var cardTitle = SKILL_NAME + ' - Recipe for ' + teamName;
        var score = teamName;

        if (teams[teamName]) {
          var _this = this;
            mlb.getScores(teamName, function(data) {
              _this.attributes['speechOutput'] = data;
              _this.attributes['repromptSpeech'] = 'Try saying repeat.';
              _this.emit(':askWithCard', data, _this.attributes['repromptSpeech'], cardTitle, data);
            });
        } else {
            var speechOutput = 'This does not appear to be an MLB team';
            var repromptSpeech = 'What else can I help with?';
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = 'You can ask questions such as, what\'s the score of the Mariners game, or, you can say exit... ' +
            'Now, what can I help you with?';
        this.attributes['repromptSpeech'] = 'You can say things like, what\'s the score of the Mariners game, or you can say exit...' +
            ' Now, what can I help you with?';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', 'Goodbye!');
    }
};
