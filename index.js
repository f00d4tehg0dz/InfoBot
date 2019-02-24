// fs is Node's native file system modul
const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');
// add config and prefix
const {
	prefix,
	token,
} = require('./config.json');
// create a new Discord client
const client = new Discord.Client();
const scraper = require('google-search-scraper');
const DeathByCaptcha = require('deathbycaptcha');
const testClass = require('./commands/helper.js');
const nodeyourmeme = require('nodeyourmeme');
const request = require('request');
const argv = require('yargs').argv;

// This next step is how you'll dynamically retrieve all your newly created command files. Add this below your client.commands line:
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// The fs.readdirSync() method will return an array of all the file names in that directory, e.g. ['ping.js', 'beep.js']. The filter is there to make sure any non-JS files are left out of the array. With that array, you can loop over it and dynamically set your commands to the Collection you made above.
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);

}
const newUsers = [];
const cooldowns = new Discord.Collection();
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	client.user.setActivity('Randomizing');
	console.log('Ready!');
});

client.on('guildCreate', guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on('guildDelete', guild => {
	// this event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on('guildMemberAdd', (member) => {
	const guild = member.guild;
	if (!newUsers[guild.id]) newUsers[guild.id] = new Discord.Collection();
	newUsers[guild.id].set(member.id, member.user);

	if (newUsers[guild.id].size > 10) {
		const userlist = newUsers[guild.id].map(u => u.toString()).join(' ');
		guild.channels.find(channel => channel.name === 'general').send('Welcome our new users!\n' + userlist);
		newUsers[guild.id].clear();
	}
});

client.on('guildMemberRemove', (member) => {
	const guild = member.guild;
	if (newUsers[guild.id].has(member.id)) newUsers.delete(member.id);
});
// Listening for messages
client.on('message', message => {
	// If the message either doesn't start with the prefix or was sent by a bot, exit early.
	// Create an args variable that slices off the prefix entirely and then splits it into an array by spaces.
	// reate a command variable by calling args.shift(), which will take the first element in array and return it while also removing it from the original array (so that you don't have the command name string inside the args array).
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const input = message.content;
	// Know your Meme
	// console.log(input);
	if (message.content.startsWith(prefix + 'kym')) {
		const userInput = input.substr('4');
		if (message.content.endsWith(userInput)) {

			nodeyourmeme.search(userInput).then(res => {
				// console.log('success', res);
				const titles = (res.name);
				const descriptions = (res.about);

				const embed = {
					'title': `${titles}`,
					'color': 14274056,
					'description': `${descriptions}`,
					'footer': {
						'icon_url': `${testClass.baseEmbedTemplate()[1]}`,
						'text': `${testClass.baseEmbedTemplate()[0]}`,
					},
					'thumbnail': {
						'url': 'https://i.kym-cdn.com/photos/images/newsfeed/001/170/526/3db.png',
					},
					'fields': [
						{
							'name': `${testClass.baseEmbedTemplate()[3]}`,
							'value': `${testClass.baseEmbedTemplate()[2]}`,
						},
					],
					'author': {
						'name': 'f00d',
					},
				};
				message.channel.send({
					embed,
				});
			}).catch(() => {
				message.channel.send('No results, check your spelling first');
			});
		}
		else {
			message.channel.send('No results, check your spelling first');
		}
	}
	// Wiki Text


	if (message.content.startsWith(prefix + 'wiki')) {
		const userInput = input.substr('6');
			const query = argv.q || userInput;
			const urlWiki = `https://en.wikipedia.org/w/api.php?action=opensearch&search="+ ${query} +"&format=json`
			request(urlWiki, function(err, response, body) {
				if (err) {
					const error = 'cannot connect to the server';
					message.channel.send(error);
					message.channel.send('No results, check your spelling first');
				}
				else {
					const wiki = JSON.parse(body);
					for (var i = 0; i < wiki[1].length; i++) {
						const wikiMessage = `You searched for ${wiki[1][i]}: ` + "\n";
						const wikiMessageDesc = `${wiki[2][i]}` + "\n" + `Follow this link to read more ` + `${wiki[3][i]}`;
						const wikiURL = `${wiki[3][i]}`;
						// console.log(wikiMessage);
						const embed = {
							'title': `${wikiMessage}`,
							'color': 14274056,
							'description': `${wikiMessageDesc}`,
							'url': `${wikiURL}`,
							'thumbnail': {
								'url': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/1280px-Wikipedia-logo-v2.svg.png'
							},
							'fields': [
								{
									'name': `${testClass.baseEmbedTemplate()[3]}`,
									'value': `${testClass.baseEmbedTemplate()[2]}`,
								},
							],
							'footer': {
								'icon_url': `${testClass.baseEmbedTemplate()[1]}`,
								'text': `${testClass.baseEmbedTemplate()[0]}`,
							},
							'author': {
								'name': 'f00d',
							},
						};
						message.channel.send({
							embed,
						});
						break;
					}
				}
			});
	}


	const dbc = new DeathByCaptcha('xxx', 'xxx');
	// Know your Meme
	if (message.content.startsWith(prefix + 'google')) {
			const userInput = input.substr('7');
			const userStripped = userInput;
			const urls = [];
			const titles = [];
			const descriptions = [];
			const options = {
				query: userStripped,
				host: 'www.google.com',
				constg: 'en',
				// age: 'y',
				solver: dbc,
				// last 24 hours ([hdwmy]\d? as in google URL)
				limit: 1,
				params: {
				},
				// params will be copied as-is in the search URL query string
			};
			// options
			scraper.search(options, function(err, url, meta) {
				if (url) {
					urls.push(url);
				}
				if (meta.titles) {
					titles.push(meta.titles);
				}
				if (meta.desc) {
					descriptions.push(meta.desc);
				}
				if (urls.length === options.limit) {
					// console.log(urls);
					if (meta.desc) {
						descriptions.push(meta.desc);
					}
					if (meta.title) {
						titles.push(meta.title);
					}
					nextStep();
				}
				// End length
				function nextStep() {
					const titleLink = titles;
					const pickone = descriptions;
					const urlLink = urls;
					const embed = {
						'title':`${titleLink}`,
						'color': 14274056,
						'description': `${pickone}`,
						'url': `${urlLink}`,
						'footer': {
							'icon_url':`${testClass.baseEmbedTemplate()[1]}`,
							'text':`${testClass.baseEmbedTemplate()[0]}`,
						},
						'thumbnail': {
							'url': 'https://blog.hubspot.com/hubfs/image8-2.jpg',
						},
						'fields': [
							{
								'name': `${testClass.baseEmbedTemplate()[3]}`,
								'value': `${testClass.baseEmbedTemplate()[2]}`,
							},
						],
						'author': {
							'name': 'f00d',
						},
					};
					message.channel.send({ embed });
				}
				// next step
			});
	}
	// if startswith

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;


	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

// login to Discord with your app's token
// with out prefix client.login(config.token)
// with prefix:
client.login(token);
