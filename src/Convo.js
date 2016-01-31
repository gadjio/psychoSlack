function Convo(bot, usersList) {
    this.bot = bot;
    this.usersList = usersList.usersList;
}

var AtmanWrapper = require('./AtmanWrapper');

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
        question = 'Question!';
    }

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
};

Convo.prototype.askHandler = function(self, response, conversation) {
    console.log('askHandler');
    var text = response.text;
    if(!self.usersList[response.user].hasOwnProperty('gender')) {
        if (text.toLowerCase().match('m')) {
            self.usersList[response.user]['gender'] = "Male";
        } else if (text.toLowerCase().match('f')) {
            self.usersList[response.user]['gender'] = "Female";
        } else {
            conversation.say("Sorry I did not quite get that");
        }
    } else {
        if (text.toLowerCase().match('a')) {
            console.log('Answered a');
        } else if (text.toLowerCase().match('b')) {
            console.log('Answered b');
        } else if (text.toLowerCase().match('c')) {
            console.log('Answered c');
        } else if (text.toLowerCase().match('z')) {
            console.log('Answered z');
        } else {
            conversation.say("Sorry I did not quite get that");
        }
    }

    self.ask(conversation, response.user);
};

module.exports = Convo;
