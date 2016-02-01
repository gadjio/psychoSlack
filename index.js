var config = require('config');
var request = require('request');
var Botkit = require('botkit');
var Convo = require('./src/Convo.js');
var AtmanWrapper = require('./src/AtmanWrapper');
var UsersList = require('./src/UsersList.js');
var MessageFormatter = require('./src/MsgFormatter.js');

// Get Server Config
var botToken = config.get('botToken');
var slackApiToken = config.get('slackApiToken');
var authToken = config.get('authToken');
var atmanApiUrl = config.get('atmanApiUrl');


console.log("\n" + "Current config:");
console.log("Bot token: " + botToken);
console.log("Slack api token: " + slackApiToken);
console.log("Authentification token: " + authToken);
console.log("Atman api url: " + atmanApiUrl);
console.log("\n");

var controller = Botkit.slackbot();
var bot = controller.spawn({ token: botToken});
var usersList = new UsersList();
var convo = new Convo(bot, usersList, authToken, atmanApiUrl);
var msgFormatter = new MessageFormatter();

var getUsers = function(status, response) {
	console.log(status);
	//console.log(response);
	usersList.loadUsersList(response);
};

bot.api.users.list( { token: slackApiToken }, getUsers); // Load users list

bot.startRTM(function(err, bot, payload) {
	if (err) {
		throw new Error('Could not connect to Slack');
	}
	else {
		console.log('Bot connected');
	}
});

controller.hears(['hello','hi'],['direct_message','direct_mention','mention'],function(bot,message) {
	bot.reply(message,"Hello.");
	bot.reply(message, JSON.stringify( message.channel));
});

controller.hears(['help'],['direct_message','direct_mention','mention'],function(bot,message) {
	bot.reply(message,"How to use me : type 'invite' to invite all people on the channel to start the test.");
});

controller.hears(['team'],['direct_message', 'direct_mention'],function(bot,message) {
	const msg = msgFormatter.getEasterEgg();
	bot.reply(message, msg);
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
		}
		else
		{
			var devResponse = JSON.stringify(response)
			console.log("channel.info : " + devResponse);
			console.log("channel members : " + response.channel.members);

			var total = response.channel.members.length;
			for (var i = 0; i < total; i++) {
				var userId = response.channel.members[i]
				var usersOptions = {
					token: slackApiToken,
					user: userId
				};

				bot.api.users.info(usersOptions, function (err, response) {
					if(response.user.is_bot){

					}else{
						var msg = {
							user: response.user.id
						};
						bot.startPrivateConversation(msg, function(err, dm){
							console.log("start conversation error : " + JSON.stringify(err));
							console.log("userId : " + response.user.id);

							convo.startFromInvite(dm, response.user.id, message.user)
						});
					}
				});
			}

			var bannerMsg = {
				"text" : "",
				"attachments": [
					{
						"color": "#1ecd26",
						"text" : "",
						"mrkdwn_in": ["text"],
						"image_url" : "http://imageshack.com/a/img923/1038/nok5eJ.png"
					}
				]
			};
			bot.reply(message, bannerMsg);
		}
	};

	console.log("bot.api.channels.info : ");
	bot.api.channels.info( { token: slackApiToken, channel: message.channel }, callBackChannelInfo );

});


