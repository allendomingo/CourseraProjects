const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url).then((client) => {
	console.log('Connected correctly to server');

	const db = client.db(dbname);

	dboper.insertDocument(
		db,
		{
			name: "Vadonut",
			description: "Test",
		},
		'dishes',
	).then((result) => {
		console.log('Insert Document:\n', result);

		return dboper.findDocuments(db, 'dishes');
	}).then((docs) => {
		console.log('Found Documents:\n', docs);

		return dboper.updateDocument(
			db,
			{ name: 'Vadonut' },
			{ description: 'Updated Test' },
			'dishes',
		);
	}).then((result) => {
		console.log('Updated Document:\n', result);

		return dboper.findDocuments(db, 'dishes');
	}).then((docs) => {
		console.log('Found Documents:\n', docs);

		return db.dropCollection('dishes');
	}).then((result) => {
		console.log('Dropped Collection', result);

		client.close();
	})
	.catch((err) => console.log(err));

}).catch((err) => console.log(err));