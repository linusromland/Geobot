// External dependencies
const mongoose = require('mongoose');

// Variable declaration
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_NAME = process.env.MONGODB_NAME || 'geobot';
const connect = mongoose.connect;
const connection = mongoose.connection;

const connectToMongo = async () => {
	return new Promise((resolve, reject) => {
		console.log('Connecting to MongoDB...');
		const mongoURI = `mongodb://${MONGODB_HOST}/${MONGODB_NAME}`;
		connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

		const db = connection;

		db.on('error', (err) => {
			console.log(
				'An error occured when trying to connect to MongoDB using the following mongoURL: "' + mongoURI + '"'
			);
			reject(err);
		});

		db.once('open', () => {
			console.log('A connection to MongoDB has been established!');
			resolve();
		});
	});
};

exports.connectToMongo = connectToMongo;
