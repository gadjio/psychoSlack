var AtmanWrapper = require('./AtmanWrapper');
var MessageFormatter = require('./MsgFormatter');
var request = require('request');

function Convo(bot, usersList) {
    this.bot = bot;
    this.usersList = usersList.usersList;
    this.messageFormatter = new MessageFormatter();
    this.atmanWrapper = new AtmanWrapper(request);
}

Convo.prototype.start = function(message) {
    console.log('start');
    var self = this;
    this.bot.startConversation(message, function (err, conversation) {
        self.askQuestion(conversation, message.user);
    });
};

Convo.prototype.askQuestion = function(conversation, user) {
    console.log('askQuestion');
    var self = this;

    if (self.usersList[user].hasOwnProperty('gender')) {
        // gender is set, fetch the next question from api, then ask it
        self.atmanWrapper.getQuestion(self.usersList[user]['authKey'], 'en-us').then(

            function(success) {

                var assessmentQuestion = JSON.parse(success.body);
                var questionId = assessmentQuestion.questionId;
                self.usersList[user]['questionId'] = questionId;
                console.log(questionId);

                var formatter = new MessageFormatter();
                var str = formatter.formatQuestion(assessmentQuestion);
                console.log(str);
                conversation.ask(str, [
                    {
                        pattern: '.*',
                        callback: function(response, conversation) {
                            self.userInputHandler(self, response, conversation);
                        }
                    }
                ]);
                conversation.next();
            }
        );
    } else {
        // we ask the gender
        var question = 'Male or Female?';
        conversation.ask(question, [
            {
                pattern: '.*',
                callback: function(response, conversation) {
                    self.userInputHandler(self, response, conversation);
                }
            }
        ]);
        conversation.next();
    }
};

Convo.prototype.userInputHandler = function(self, response, conversation) {
    console.log('userInputHandler');
    var text = response.text;
    if(!self.usersList[response.user].hasOwnProperty('gender')) {

        var randomName = Math.floor(Math.random() * 1000) + 1;
        var email = 'test' + randomName + '@gmail.com';

        if (text.toLowerCase().match('m')) {
            self.usersList[response.user]['gender'] = "Male";
            self.atmanWrapper.createCandidate(email, 'marc', 'beaudry', 'M', 'en').then(
                function(success) {
                    var authKey = success.body;
                    self.usersList[response.user]['authKey'] = authKey;
                    console.log(authKey);
                    self.askQuestion(conversation, response.user);
                }, function(failure) {
                    self.askQuestion(conversation, response.user);
                }
            );
        } else if (text.toLowerCase().match('f')) {
            self.usersList[response.user]['gender'] = "Female";
            self.atmanWrapper.createCandidate(email, 'marc', 'beaudry', 'F', 'en').then(
                function(success) {
                    var authKey = success.body;
                    self.usersList[response.user]['authKey'] = authKey;
                    console.log(authKey);
                    self.askQuestion(conversation, response.user);
                }, function(failure) {
                    self.askQuestion(conversation, response.user);
                }
            );
        } else {
            conversation.say("Sorry I did not quite get that");
            self.askQuestion(conversation, response.user);
        }
    } else {
        if (text.toLowerCase().match('[a|b|c|z]')) {
            console.log('Answered a');
            //authKey, questionId, answer, languageCode
            self.atmanWrapper.answerQuestion(
                self.usersList[response.user]['authKey'],
                self.usersList[response.user]['questionId'], text.toUpperCase(), 'en-us').then(
                function(success) {
                    var authKey = success.body;
                    console.log(authKey);
                    self.askQuestion(conversation, response.user);
                }, function(failure) {
                    self.askQuestion(conversation, response.user);
                }
            );
        } else {
            conversation.say("Sorry I did not quite get that");
            self.askQuestion(conversation, response.user);
        }
    }

};

module.exports = Convo;
