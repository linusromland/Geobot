// External Dependencies
const mongoose = require('mongoose');

// Internal Dependencies
const defaultMaps = require('../data/defaultMaps.json');
const { Schema } = mongoose;

const userSchema = new Schema(
	{
		discordId: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: (v) => {
					return /^\d+$/.test(v);
				},
				message: (props) => `${props.value} is not a valid Discord ID!`
			}
		},
		maps: [
			{
				mapId: {
					type: String,
					required: true
				},
				name: {
					type: String,
					required: true
				},
				description: {
					type: String,
					required: true
				},
				emoji: {
					type: String,
					required: true
				},
				createdAt: {
					type: Date,
					default: Date.now
				}
			}
		],
		mapCreation: {
			type: Object
		}
	},
	{
		timestamps: true
	}
);

userSchema.pre('save', function (next) {
	if (this.isNew) {
		this.maps = defaultMaps;
	}
	next();
});

module.exports = mongoose.model('User', userSchema);
