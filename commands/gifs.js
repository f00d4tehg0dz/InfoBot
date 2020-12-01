const redditSubModule = 'gifs';
const request = require('request-promise');
const testClass = require('../commands/helper.js');
module.exports = {
	name: 'jiff',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message) {
		request.get('https://www.reddit.com/r/' + redditSubModule + '/new.json?limit=200').then(function(body) {
			const obj = JSON.parse(body);
			const posts = obj.data.children.map(function(post) {
				return post.data;
			});
			const pickone =	testClass.shuffle(posts);
			const urlLink = (pickone[0].url);
			console.log('grabbing url', urlLink);
			const postTitle = (pickone[0].title);
			const postTitleStrip = postTitle.slice(0, 20);
			const postAuthor = (pickone[0].author);
			const urlThumb = (pickone[0].thumbnail);

			function gfy() {
				if (urlLink.includes('gfycat')) {
					const urlLinkSplice = urlLink.split('/').slice(3);
					const finalURL = 'https://thumbs.gfycat.com/' + `${urlLinkSplice}` + '-size_restricted.gif';
					message.channel.send('You wont belive this, but we dont support gfycat');
					return finalURL;
				}
				else if (testClass.get_url_extension(urlLink) === ('gifv')) {

					const urlLinkSplice = urlLink.slice(0, -1);
					const finalURL = urlLinkSplice;
					console.log('URL', urlLink);
					console.log(finalURL);
					return finalURL;
				}
				else if (urlLink.includes('gif')) {
					const finalURL = urlLink;
					console.log('gif');
					return finalURL;
				}

				else if (testClass.get_url_extension(urlLink) === ('jpg')) {
					const finalURL = urlLink;
					console.log('jpg')
					return finalURL;
				}
				else if (urlLink.includes('redd')) {
					const urlLinkSplice = urlLink.split('/').slice(3);

					const finalURL = 'https://v.redd.it/' + `${urlLinkSplice}` + '.gif';
					// https://v.redd.it/h4d35o425ei21
					console.log('reddit')
					// console.log(finalURL);
					return finalURL;
				}
				else {
					console.log(urlLink);
					const finalURL = 'https://media.giphy.com/media/ALalVMOVR8Qw/giphy.gif';
					message.channel.send('You wont believe this, but no results! Try again!');
					return finalURL;
				}
			}
			const gfyexists = gfy();
			console.log(gfyexists);
			// console.log("title", testClass.baseEmbedTemplate()[0]);
			// console.log("footer", testClass.baseEmbedTemplate()[1]);
			const embed = {
				'title':`${postTitleStrip}`,
				'color': 14274056,
				'footer': {
					'icon_url': `${testClass.baseEmbedTemplate()[1]}`,
					'text': `${testClass.baseEmbedTemplate()[0]}`,
				},
				'thumbnail': {
					'url': `${urlThumb}`,
				},
				'image': {
					'url':  `${gfyexists}`,
				},
				'author': {
					'name': `${postAuthor}`,
				},
			};
			message.channel.send({ embed });
		});
	},
};
