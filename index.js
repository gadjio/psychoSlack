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

var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
	token: botToken
})

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

controller.hears(['attach'],['direct_message','direct_mention'],function(bot,message) {

	var attachments = [];
	var attachment = {
		title: 'This is an attachment',
		color: '#FFCC99',
		fields: [],
	};

	attachment.fields.push({
		label: 'Field',
		value: 'A longish value',
		short: false,
	});

	attachment.fields.push({
		label: 'Field',
		value: 'Value',
		short: true,
	});

	attachment.fields.push({
		label: 'Field',
		value: 'Value',
		short: true,
	});

	attachments.push(attachment);

	bot.reply(message,{
		text: 'See below...',
		attachments: attachments,
	},function(err,resp) {
		console.log(err,resp);
	});
});

controller.hears(['dm me'],['direct_message','direct_mention'],function(bot,message) {
	bot.startConversation(message,function(err,convo) {
		convo.say('Heard ya');
	});

	bot.startPrivateConversation(message,function(err,dm) {
		dm.say('Private reply!');
	});

});

function SetAnswer(answerLetter){
    return {
        pattern: answerLetter,
        callback: function(response,convo) {

            // send answer to api

            convo.say('your have answer ! ' + answerLetter);
            convo.next();
        }
    };
}

function StartConversation(bot, message, question) {
    question = question || 'Le hackaton est ben fun.\n A)je suis daccord \nB) pas daccord \nC) incertain \nD) passer ';
// start a conversation to handle this response.
    bot.startConversation(message, function (err, convo) {

        convo.ask(question, [
            SetAnswer('A'),
            SetAnswer('B'),
            SetAnswer('C'),
            SetAnswer('S'),
        ]);

    })
}
controller.hears(['start'],['direct_message','direct_mention','mention','ambient'],function(bot,message) {

    // get questions

	StartConversation(bot, message, 'Le hackaton est ben fun.\n A)je suis daccord \nB) pas daccord \nC) incertain \nD) passer ');

});

