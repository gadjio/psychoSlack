function MessageSender(bot, user) {
    this.bot = bot;
    this.user = user;
};

MessageSender.prototype.send = function(msg) {
    this.bot.postMessageToUser(this.user, msg);
};

module.exports = MessageSender;
