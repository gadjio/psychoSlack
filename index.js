var SlackBot = require('slackbots');
var config = require('config');
var Convo = require('./src/Convo.js');
var request = require('request');
var AtmanWrapper = require('./src/AtmanWrapper');
var UsersList = require('./src/UsersList.js');

// Get Server Config
var botToken = config.get('botToken');
var botName = config.get('botName');
var testUser = config.get('testUser');

var optionToken = 'xoxp-19879990401-19874729492-19892570103-995c3fc727'
var options = {
	token: optionToken,
};

var invitationMessage ="Hello there!, " + Date.now();
//var invitationMessage ="Hello there!, You have been invited to do Atman assessment"


console.log("\n" + "Current config:");
console.log("Bot optionToken: " + botToken);
console.log("Bot name: " + botName);
console.log("Test user: " + testUser + "\n");

var wrapper = new AtmanWrapper(request);
var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
	token: botToken
});
var usersList = new UsersList();
var convo = new Convo(bot, usersList, wrapper);

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
		console.log('Connected to bot ' + botName);
	}
});


controller.hears(['hello','hi'],['direct_message','direct_mention','mention'],function(bot,message) {
	bot.reply(message,"Hello.");
	bot.reply(message, JSON.stringify( message.channel));
});

controller.hears(['help'],['direct_message','direct_mention','mention'],function(bot,message) {
	bot.reply(message,"How to use me : type 'invite' to invite all people on the channel to start the test.");
});

controller.hears(['start'],['direct_message'],function(bot,message) {
	convo.start(message);
});

controller.hears(['invite'],['direct_mention'],function(bot,message) {

	var callBackChannelInfo = function(status, response){

		if(status != undefined)
		{
			console.log('status :');
			console.log(status);
		}else
		{
			var devResponse = JSON.stringify(response)
			console.log("channel.info : " + devResponse);
			console.log("channel members : " + response.channel.members);

			var total = response.channel.members.length;
			for (var i = 0; i < total; i++) {
				var userId = response.channel.members[i]
				var usersOptions = {
					token: optionToken,
					user: userId
				};

				bot.api.users.info(usersOptions, function (err, response) {
					if(response.user.is_bot){

					}else{
						var msg = {
							user: response.user.id
						};
						bot.startPrivateConversation(msg, function(err, dm){
							console.log(JSON.stringify(err));

							dm.say(invitationMessage, function (err, response){
								console.log(JSON.stringify(response));
								convo.start(response);

							});

							//var dmMessage={
							//	channel : dm.channel,
							//	user : msg.user
							//}
                            //
							//message.channel = dm.channel;
							//message.user = msg.user;
							//console.log(JSON.stringify(message));


						});
					}

				});


			}
		}
	};

	var options = {
		token: optionToken,
		channel: message.channel
	};


	console.log("bot.api.channels.info : ");
	bot.api.channels.info( options, callBackChannelInfo );

});


