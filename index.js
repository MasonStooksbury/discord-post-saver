require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});



const TOKEN = process.env.TOKEN;
const approved_emoji = '✉️'





client.login(TOKEN);


client.on('messageReactionAdd', reaction => {
	// Only do stuff if the person sends the approved emoji
	if (approved_emoji === reaction._emoji.toString()) {
		const message_id = reaction.message.id
		const channel_id = reaction.message.channelId
	
		// Grab the old message content and its attachments and send that to the user who reacted
		client.channels.cache.get(channel_id).messages.fetch(message_id).then((msg) => {
			let big_ass_object_array = []
			msg.attachments.forEach(img => {
				big_ass_object_array.push({attachment: img.url, name:img.name})
			})
	
			// Convert the milliseconds into a human-readable format
			const timestamp = msg.createdTimestamp
			const milliseconds = timestamp
			const dateObject = new Date(milliseconds)
			const humanDateFormat = dateObject.toLocaleString("en-US", {timeZoneName: "short"})
	
			// Send the user that reacted to a message the contents of the message
			// If the user has DMs turned off, it will let them know to try again
			msg.author.send({files: big_ass_object_array, content:`Originally posted by: ${reaction.message.author} on ${humanDateFormat}\n\n${msg.content}`}).catch(() => msg.reply('Please turn on DMs, and try again'));
		})
	}
});


// When the bot connects
client.on('ready', () => {
	console.info(`Logged in as ${client.user.tag}!`);
});
