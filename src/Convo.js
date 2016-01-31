function Convo(bot, usersList) {
    this.bot = bot;
    this.usersList = usersList;
}

Convo.prototype.start = function(message) {
    if (this.usersList.getGender(message.user) === "undef") {
      this.askQuestion(message); // Check if you need to kill current convo conversation.next()
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
                conversation.repeat();
                conversation.next();
            }
        }
    };
};

Convo.prototype.askQuestion = function(message) {
    var self = this;
    // var question = GetQuestion();

    var question = 'Le hackaton est ben fun.\n A) je suis daccord \nB) pas daccord \nC) incertain \nD) passer ';

    // start a conversation to handle this response.
    this.bot.startConversation(message, function (err, conversation) {
        conversation.ask(question, [
            self.askQuestionCallback('[a|A]'),
            self.askQuestionCallback('[b|B]'),
            self.askQuestionCallback('[c|C]'),
            self.askQuestionCallback('[s|S]'),
            self.errCallback(true)
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
            self.errCallback(true)
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
                conversation.say("\"" + answer + "\" is not a valid response" );
                conversation.repeat();
                conversation.next();
            }
        }
    };
};

Convo.prototype.errCallback = function(answer) {
    return {
        default: true,
        callback: function(response, conversation) {
            conversation.say("Sorry I did not quite get that");
            conversation.repeat();
            conversation.next();
        }
    };
};

module.exports = Convo;
