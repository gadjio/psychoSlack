var SlackBot = require('slackbots');
var config = require('config');

// Get Server Config
var botToken = config.get('botToken');
var botName = config.get('botName');
var testUser = config.get('testUser');

console.log("\n" + "Current config:");
console.log("Bot token: " + botToken);
console.log("Bot name: " + botName);
console.log("Test user: " + testUser + "\n");

// create a bot 
var bot = new SlackBot({
	token: botToken,
	name:  botName
});

bot.on('start', function() {
	// more information about additional params https://api.slack.com/methods/chat.postMessage 
	var params = {
		icon_emoji: ':cat:'
	};

	// define channel, where bot exist. You can adjust it there https://my.slack.com/services  
	//bot.postMessageToChannel('general', 'meow!', params);

	// define existing username instead of 'user_name' 
	//bot.postMessageToUser('user_name', 'meow!', params); 

	// define private group instead of 'private_group', where bot exist 
	//bot.postMessageToGroup('private_group', 'meow!', params); 

	bot.on('message', function(data) {
		// all ingoing events https://api.slack.com/rtm 
		console.log(data);

		if (data.text === "start") {
			bot.postMessageToUser(testUser, 'hi').then(function(data) {
				console.log("fail");	
			})
		}
	});
});

