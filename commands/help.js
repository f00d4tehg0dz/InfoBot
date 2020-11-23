const { prefix } = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Here\'s a list of all my commands:');
			// data.push(commands.map(command => command.name).join(', '));
			// data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);
			data.push(`\nTo search with Google, Simply Type  \`${prefix}google [your search] \` Don't actually use [] in this to get your info!`);
			data.push(`\nTo search Wikipedia, Simply Type  \`${prefix}wiki [your search] \` Don't actually use [] in this to get your info!`);
			data.push(`\nTo search Know your Meme, Simply Type  \`${prefix}kym [your search] \` Don't actually use [] in this to get your info!`);
			data.push(`\nTo search Fandom, Simply Type  \`${prefix}fandom [your search] \` Don't actually use [] in this to get your info!`);
			data.push(`\nTo search IMDB, Simply Type  \`${prefix}imdb [your search] \` Don't actually use [] in this to get your info!`);
			data.push(`\nTo flip a coin, Simply Type  \`${prefix}flipcoin\``);
			data.push('\ncredit to discord user perfectthunder426 for help on the help to get your info!');
			data.push(`\nEXPERIMENTAL!! Random Gifs, Simply Type  \`${prefix}jiff \` to get a random gif from popular subreddits`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};
