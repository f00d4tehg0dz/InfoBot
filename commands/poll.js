const testClass = require('../commands/helper.js');
const { prefix } = require('../config.json');

module.exports = {
	name: 'poll',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		// eslint-disable-next-line no-case-declarations
		// const embed = {
		// 	'title':'Initiate Poll',
		// 	'color': 14274056,
		// 	'description': '!poll to initiate a simple yes or no poll',
		// };
		// if(!args[1]) {
		// 	message.channel.send({ embed });
		// }
		// eslint-disable-next-line no-case-declarations
		const msgArgs = args.slice(0).join(' ');
		message.channel.send('**' + '❓' + msgArgs + '**').then(messageReaction => {
			messageReaction.react('👍');
			messageReaction.react('👎');
			message.delete(3000).catch(console.error);
		});
	// message.channel.send({ embed });
		// });
	},
};
