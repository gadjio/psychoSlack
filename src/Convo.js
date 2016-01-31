function Convo(bot, usersList) {
    this.bot = bot;
    this.usersList = usersList;
    this.messageFormatter = new MessageFormatter();
}

var AtmanWrapper = require('./AtmanWrapper');
var MessageFormatter = require('./MsgFormatter');

Convo.prototype.start = function(message) {
    if (this.usersList.getGender(message.user)) {
      this.askQuestion(message);
    } else {
      this.askGender(message);
    }
};

Convo.prototype.askQuestionCallback = function(answer) {
    return {
        pattern: answer,
        callback: function(response,conversation) {

            if (answer === '[a|A]') {
                // sendReponse(userId, 'a');
            } else if(answer === "[b|B]") {
                // sendReponse(userId, 'b');
            } else if(answer === "[c|C]") {
                // sendReponse(userId, 'c');
            } else if(answer === "[s|S]") {
                // skip('f');
            } else {
                conversation.say("\"" + answer + "\" is not a valid response" );
                conversation.next();
                self.askQuestion(message);
            }
        }
    };
};

Convo.prototype.errAskQuestionCallback = function(answer) {
    self = this;
    return {
        default: true,
        callback: function(response, conversation) {
            conversation.say("Sorry I did not quite get that");
            conversation.next();
            self.askQuestion(message);
        }
    };
};

Convo.prototype.askQuestion = function(message) {
    var self = this;
    //var question = GetQuestion();

    var question = {
        "assessmentQuestion": "Usually, when I go to bed:",
        "assessmentAnswer": [{
            "value": "A",
            "text": "I fall asleep as soon as my head hits the pillow",
            "isDisabled": false
        }, {
            "value": "B",
            "text": "in between",
            "isDisabled": false
        }, {
            "value": "C",
            "text": "I toss and turn for a while before falling asleep",
            "isDisabled": false
        }, {
            "value": "Z",
            "text": "Skip",
            "isDisabled": false
        }],
        "currentQuestionNumber": 1,
        "totalNumberOfQuestions": 70,
        "numberOfBLeft": 3,
        "numberOfQuestionAnswered": 0,
        "questionId": 10,
        "assesmentIsCompleted": false,
        "localizedNumberOfB": "3 \"B\" answer(s) left of 11",
        "canUsePrevious": false
    };

    var formattedQuestion = this.messageFormatter.formatQuestion(question);

    // start a conversation to handle this response.
    this.bot.startConversation(message, function (err, conversation) {
        conversation.ask(formattedQuestion, [
            self.askQuestionCallback('[a|A]'),
            self.askQuestionCallback('[b|B]'),
            self.askQuestionCallback('[c|C]'),
            self.askQuestionCallback('[s|S]'),
            self.errAskQuestionCallback(true)
        ]);
    })
};

Convo.prototype.askGender = function(message) {
    var self = this;
    var question = 'Male or Female? ';

    // start a conversation to handle this response.
    this.bot.startConversation(message, function (err, conversation) {
        conversation.ask(question, [
            self.askGenderCallback('[f|F]'),
            self.askGenderCallback('[m|M]'),
            self.errAskGenderCallback(true)
        ]);
    })
};

Convo.prototype.askGenderCallback = function(answer) {
    var self = this;
    return {
        pattern: answer,
        callback: function(response, conversation) {

            if (answer === '[m|M]') {
                self.usersList.setGender(response.user, "Male");
                self.askQuestion(response);
            } else if(answer === "[f|F]") {
                self.usersList.setGender(response.user, "Female");
                self.askQuestion(response);
            } else {
                console.log("wtf");
                conversation.say("\"" + answer + "\" is not a valid response" );
                conversation.repeat();
                conversation.next();
            }
        }
    };
};

Convo.prototype.errAskGenderCallback = function(answer) {
    return {
        default: true,
        callback: function(response, conversation) {
            console.log("wtf2");
            conversation.say("Sorry I did not quite get that");
            conversation.repeat();
            conversation.next();
        }
    };
};

module.exports = Convo;
