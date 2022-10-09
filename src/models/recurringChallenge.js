// External Dependencies
const mongoose = require('mongoose');

// Internal Dependencies
const { Schema } = mongoose;

const recurringChallengeSchema = new Schema(
	{
		discordServerId: {
			type: String,
			required: true,
			validate: {
				validator: (v) => {
					return /^\d+$/.test(v);
				}
			}
		},
		discordChannelId: {
			type: String,
			required: true,
			validate: {
				validator: (v) => {
					return /^\d+$/.test(v);
				}
			}
		},
		mapId: {
			type: String,
			required: true
		},
		timeLimit: {
			type: Number,
			required: true
		},
		gameSettings: {
			type: Object,
			required: true
		},
		recurringFrequency: {
			type: String,
			required: true,
			enum: ['daily', 'weekly']
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('RecurringChallenge', recurringChallengeSchema);
