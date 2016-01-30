var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
	token: 'xoxb-19882625490-vbCmxDySt8aFOtT705t5wqjk'
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