var SlackBot = require('slackbots');
var config = require('config');
var Convo = require('./src/Convo.js');
var UsersList = require('./src/UsersList.js');

// Get Server Config
var botToken = config.get('botToken');
var botName = config.get('botName');
var testUser = config.get('testUser');

var options = {
	token: 'xoxp-19879990401-19874729492-19892570103-995c3fc727',
};

console.log("\n" + "Current config:");
console.log("Bot token: " + botToken);
console.log("Bot name: " + botName);
console.log("Test user: " + testUser + "\n");


var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
	token: botToken
});
var usersList = new UsersList();
var convo = new Convo(bot, usersList);

var getUsers = function(status, response){
	console.log(status);
	//console.log(response);
	usersList.loadUsersList(response);
};

bot.api.users.list(options, getUsers); // Load users list

bot.startRTM(function(err,bot,payload) {
	if (err) {
		throw new Error('Could not connect to Slack');
	}
	else {
		console.log('Connected to bot ' + this.name);
	}
});


controller.hears(['hello','hi'],['direct_message','direct_mention','mention'],function(bot,message) {
	bot.reply(message,"Hello.");
});

controller.hears(['start'],['direct_message','direct_mention','mention','ambient'],function(bot,message) {
	convo.start(message);
});

