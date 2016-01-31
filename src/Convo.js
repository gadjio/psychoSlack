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
        self.ask(conversation, message.user);
    })
};

Convo.prototype.ask = function(conversation, user) {
    console.log('ask');
    var self = this;
    var question = 'Male or Female?';
    if (self.usersList[user].hasOwnProperty('gender')) {
        self.atmanWrapper.getQuestion(self.usersList[user]['authKey'], 'en-us').then(
            function(success) {

                var assessmentQuestion = JSON.parse(success.body);
                var questionId = assessmentQuestion.questionId;
                self.usersList[user]['questionId'] = questionId;
                console.log(questionId);

                //var str = this.messageFormatter.formatQuestion(assessmentQuestion);
                //console.log(str);
                //console.log(assessmentQuestion.assessmentQuestion);
                conversation.ask(assessmentQuestion.assessmentQuestion, [
                    {
                        pattern: '.*',
                        callback: function(response, conversation) {
                            self.askHandler(self, response, conversation);
                            conversation.next();
                            console.log('next');
                        }
                    }
                ]);
            }
        );
    } else {
        conversation.ask(question, [
            {
                pattern: '.*',
                callback: function(response, conversation) {
                    self.askHandler(self, response, conversation);
                    conversation.next();
                    console.log('next');
                }
            }
        ]);
    }
};

Convo.prototype.askHandler = function(self, response, conversation) {
    console.log('askHandler');
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
                    self.ask(conversation, response.user);
                }, function(failure) {
                    self.ask(conversation, response.user);
                }
            );
        } else if (text.toLowerCase().match('f')) {
            self.usersList[response.user]['gender'] = "Female";
            self.atmanWrapper.createCandidate(email, 'marc', 'beaudry', 'F', 'en').then(
                function(success) {
                    var authKey = success.body;
                    self.usersList[response.user]['authKey'] = authKey;
                    console.log(authKey);
                    self.ask(conversation, response.user);
                }, function(failure) {
                    self.ask(conversation, response.user);
                }
            );
        } else {
            conversation.say("Sorry I did not quite get that");
            self.ask(conversation, response.user);
        }
    } else {
        if (text.toLowerCase().match('a')) {
            console.log('Answered a');
            //authKey, questionId, answer, languageCode
            self.atmanWrapper.answerQuestion(
                self.usersList[response.user]['authKey'],
                self.usersList[response.user]['questionId'], 'A', 'en-us').then(
                function(success) {
                    var authKey = success.body;
                    console.log(authKey);
                    self.ask(conversation, response.user);
                }, function(failure) {
                    self.ask(conversation, response.user);
                }
            );
        } else if (text.toLowerCase().match('b')) {
            console.log('Answered b');
        } else if (text.toLowerCase().match('c')) {
            console.log('Answered c');
        } else if (text.toLowerCase().match('z')) {
            console.log('Answered z');
        } else {
            conversation.say("Sorry I did not quite get that");
        }
        self.ask(conversation, response.user);
    }

};

module.exports = Convo;
