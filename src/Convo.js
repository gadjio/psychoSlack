var AtmanWrapper = require('./AtmanWrapper');
var MessageFormatter = require('./MsgFormatter');
var request = require('request');

function Convo(bot, usersList, authToken, atmanApiUrl) {
    this.useRandomEmail = false;
    this.debug = false;
    this.bot = bot;
    this.usersList = usersList.usersList;
    this.atmanWrapper = new AtmanWrapper(request, authToken, atmanApiUrl, this.debug);
}


Convo.prototype.startFromInvite = function(dm, userId, requestingUserId) {
    console.log('start from invite');
    this.askQuestion(dm, userId, requestingUserId);

};

Convo.prototype.start = function(message) {
    if(this.debug) console.log('start');
    var self = this;
    this.bot.startConversation(message, function (err, conversation) {
        self.askQuestion(conversation, message.user);
    });
};

Convo.prototype.askQuestion = function(conversation, user, requestingUserId) {
    if(this.debug) console.log('askQuestion');
    var self = this;

    if (!requestingUserId && self.usersList[user].hasOwnProperty('bloomedError')) {
        if(this.debug) console.log('hasOwnProperty bloomedError');
        conversation.next();
        return;
    }

    if (requestingUserId && requestingUserId != user && self.usersList[user].hasOwnProperty('bloomedError')) {
        if(this.debug) console.log('hasOwnProperty bloomedError');
        return;
    }

    if (self.usersList[user].hasOwnProperty('authKey')) {
        if(this.debug) console.log('hasOwnProperty authkey');
        //continue
    } else {
        var currentUser = self.usersList[user];
        var password = user.substr(0, 5);
        self.atmanWrapper.candidateAuthentication(currentUser.email, password).then(
            function (authKey) {
                if(this.debug) console.log('login reponse' + authKey);
                if (authKey) {
                    if(this.debug) console.log('login success');
                    self.usersList[user]['authKey'] = authKey;
                    self.atmanWrapper.getCandidateState(authKey).then(
                        function (candidateState) {
                            if(this.debug) console.log('getCandidateState success');
                            self.usersList[user]['assessmentIsCompleted'] = candidateState.assessmentIsCompleted;
                        }
                    );
                } else {
                    if(this.debug) console.log('login fail - no auth key');
                }
            }
        );
    }

    if( self.usersList[user].hasOwnProperty('assessmentIsCompleted') && self.usersList[user]['assessmentIsCompleted'] == true){
        // nothing happen to the candidate - test is already completed
        if(this.debug) console.log('assessmentIsCompleted');
        return;
    }

    if (self.usersList[user].hasOwnProperty('authKey')) {

        // candidate is created, fetch the next question from api, then ask it
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
                            var str = formatter.formatResult(skills, self.usersList[user]['bloomedUsername']);
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
            conversation.say(this.getIntroMessage(user, requestingUserId));
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

Convo.prototype.getIntroMessage = function(user, requestingUserId) {
    var introBegin;

    if (requestingUserId && user != requestingUserId) {
        console.log(this.usersList[requestingUserId].name);
        introBegin =  "Care to figure out your innate skills? " +
            this.usersList[requestingUserId].real_name +
            " invited you to complete a personality test.\n";
    } else {
        introBegin = "We are glad to see you’re eager to learn more about your innate skills with this personality test! "
    }

    return introBegin +
        "It’s simple: just answer these 70 short questions and you will get your results instantly. Careful: you can’t pick “B” more than 11 times.\n" +
        "Have fun!";
};


Convo.prototype.userInputHandler = function(self, response, conversation) {
    if(this.debug) console.log('userInputHandler');
    var text = response.text;
    var currentUser = self.usersList[response.user];
    if(!currentUser.hasOwnProperty('gender')) {

        var email = currentUser.email;
        if(self.useRandomEmail) {
            var split = currentUser.email.split('@');
            email = split[0] + '+' + Date.now() + '@' + split[1];
        }

        if (text.toLowerCase().match('^[m|f]$')) {
            var gender = text.toUpperCase();
            var password = response.user.substr(0,5);
            currentUser['gender'] = gender;
            currentUser['bloomedUsername'] = email;
            currentUser['bloomedPassword'] = password;
            self.atmanWrapper.createCandidate(email, currentUser.first_name, currentUser.last_name, gender, 'en-us', password).then(
                function(success) {
                    var authKey = success.body;
                    currentUser['authKey'] = authKey;
                    if(self.debug) console.log(authKey);
                    self.askQuestion(conversation, response.user);
                }, function(failure) {
                    if(self.debug) console.log(JSON.stringify(failure));
                    currentUser['bloomedError'] = true;
                    delete currentUser['gender'];
                    delete currentUser['saidIntro'];
                    conversation.say(failure.message);
                    self.askQuestion(conversation, response.user);
                    //self.askQuestion(conversation, response.user);
                }
            );
        } else {
            conversation.say("This test was created for human beings only! Please type M for male, or F for female");
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
            conversation.say("Please type A, B, or C according to your answer.");
            self.askQuestion(conversation, response.user);
        }
    }
};

module.exports = Convo;
