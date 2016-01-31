var AtmanWrapper = require('./AtmanWrapper');
var MessageFormatter = require('./MsgFormatter');
var request = require('request');

function Convo(bot, usersList, authToken, atmanApiUrl) {
    this.useRandomEmail = true;
    this.debug = false;
    this.bot = bot;
    this.usersListObj = usersList;
    this.usersList = usersList.usersList;
    this.atmanWrapper = new AtmanWrapper(request, authToken, atmanApiUrl, this.debug);
}


Convo.prototype.startFromInvite = function(dm, userId) {
    console.log('start from invite');
    this.askQuestion(dm, userId);

};

Convo.prototype.start = function(message) {
    if(this.debug) console.log('start');
    var self = this;
    this.bot.startConversation(message, function (err, conversation) {
        self.askQuestion(conversation, message.user);
    });
};

Convo.prototype.askQuestion = function(conversation, user) {
    if(this.debug) console.log('askQuestion');
    var self = this;

    if (self.usersList[user].hasOwnProperty('gender')) {

        // gender is set, fetch the next question from api, then ask it
        var authKey = self.usersList[user]['authKey'];
        self.atmanWrapper.getQuestion(authKey, 'en-us').then(

            function(success) {

                var assessmentQuestion = JSON.parse(success.body);
                if(assessmentQuestion.assessmentQuestion != null) {
                    var questionId = assessmentQuestion.questionId;
                    self.usersList[user]['questionId'] = questionId;
                    if(self.debug) console.log(questionId);

                    var formatter = new MessageFormatter();
                    var str = formatter.formatQuestion(assessmentQuestion);
                    if(self.debug) console.log(str);
                    conversation.ask(str, [
                        {
                            pattern: '.*',
                            callback: function(response, conversation) {
                                self.userInputHandler(self, response, conversation);
                            }
                        }
                    ]);
                    conversation.next();
                } else {

                    conversation.say("Please wait while we process your answers...");
                    self.atmanWrapper.getSkills(self.usersList[user]['authKey']).then(

                        function(success) {
                            var skills = JSON.parse(success.body);
                            var formatter = new MessageFormatter();
                            var str = formatter.formatResult(skills);
                            if(self.debug) console.log(str);

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

                }
            }
        );
    } else {
        // we ask the gender
        if(!self.usersList[user].hasOwnProperty('saidIntro')) {
            conversation.say(this.getIntroMessage(user));
            self.usersList[user]['saidIntro'] = true;
        }
        var formatter = new MessageFormatter();
        var str = formatter.getGenderQuestion();
        if(self.debug) console.log(str);
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
};

Convo.prototype.getIntroMessage = function(user){
    var fullName = this.usersListObj.getFullName(user);
    return "Salut " + fullName + "!!! Bonne chan le gran";
};


Convo.prototype.userInputHandler = function(self, response, conversation) {
    if(this.debug) console.log('userInputHandler');
    var text = response.text;
    var currentUser = self.usersList[response.user];
    if(!currentUser.hasOwnProperty('gender')) {

        var email = currentUser.email;
        if(self.useRandomEmail) {
            var randomName = Math.floor(Math.random() * 1000) + 1;
            var split = currentUser.email.split('@');
            email = split[0] + '+' + randomName + '@' + split[1];
        }

        if (text.toLowerCase().match('^[m|f]$')) {
            var gender = text.toUpperCase();
            currentUser['gender'] = gender;
            self.atmanWrapper.createCandidate(email, currentUser.first_name, currentUser.last_name, gender, 'en-us').then(
                function(success) {
                    var authKey = success.body;
                    currentUser['authKey'] = authKey;
                    if(self.debug) console.log(authKey);
                    self.askQuestion(conversation, response.user);
                }, function(failure) {
                    self.askQuestion(conversation, response.user);
                }
            );
        } else {
            conversation.say("Sorry, you selected an invalid gender");
            self.askQuestion(conversation, response.user);
        }
    } else {
        if (text.toLowerCase().match('^[a|b|c|z]$')) {
            if(self.debug) console.log('Answered');

            self.atmanWrapper.answerQuestion(
                currentUser['authKey'],
                currentUser['questionId'], text.toUpperCase(), 'en-us').then(
                function(success) {
                    var authKey = success.body;
                    if(self.debug) console.log(authKey);
                    self.askQuestion(conversation, response.user);
                }, function(failure) {
                    self.askQuestion(conversation, response.user);
                }
            );
        } else {
            conversation.say("Sorry, you selected an invalid option");
            self.askQuestion(conversation, response.user);
        }
    }

};

module.exports = Convo;
