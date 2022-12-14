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
		forbidMoving: {
			type: Boolean,
			required: true
		},
		forbidRotating: {
			type: Boolean,
			required: true
		},
		forbidZooming: {
			type: Boolean,
			required: true
		},
		recurringFrequency: {
			type: String,
			required: true,
			enum: ['daily', 'weekly']
		},
		recurringDay: {
			type: String,
			required: false,
			enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
		},
		recurringHour: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('RecurringChallenge', recurringChallengeSchema);
