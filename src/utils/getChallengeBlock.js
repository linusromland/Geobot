// External Dependencies
const { EmbedBuilder } = require('discord.js');
const pretty = require('pretty-time');

//Variable declaration
const challengeURL = 'https://www.geoguessr.com/challenge/';
const imageURL = 'https://www.geoguessr.com/images/auto/1920/1080/ce/0/plain/';
const defaultImage = 'map/3f950f0318b9086b1b9ec591206dfdd8.jpg'; // Image of world

function getChallengeBlock({ name, images }, timeInSec, matchToken, userId) {
	const prettyTime = pretty([timeInSec, 0], 's');

	const matchURL = challengeURL + matchToken;

	const embed = new EmbedBuilder()
		.setTitle('New Geoguessr challenge!')
		.setDescription(`Map: ${name}\nTime: ${prettyTime}\nCreated by <@${userId}>`)
		.setImage(imageURL + (images.backgroundLarge ?? defaultImage))
		.setURL(matchURL)
		.setColor('#FF0000');

	return embed;
}

module.exports = getChallengeBlock;
