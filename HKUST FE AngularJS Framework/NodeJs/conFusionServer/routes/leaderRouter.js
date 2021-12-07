const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
	.all((_, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	.get((_, res, __) => {
		res.end('Will send all the leaders to you!');
	})
	.post((req, res, _) => {
		res.end('Will add the leader: ' + req.body.name
			+ ' with details: ' + req.body.description);
	})
	.put((_, res, __) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /leaders');
	})
	.delete((_, res, __) => {
		res.end('Deleting all leaders');
	});

leaderRouter.route('/:leaderId')
	.get((req, res, _) => {
		res.end('Will send details of the leader: '
			+ req.params.leaderId + ' to you!');
	})
	.post((req, res, _) => {
		res.statusCode = 403;
		res.end('POST operation not supported on /leaders/'
			+ req.params.leaderId);
	})
	.put((req, res, _) => {
		res.write('Updating the leader: ' + req.params.leaderId + '\n');
		res.end('Will update the leader: ' + req.body.name
			+ ' with details: ' + req.body.description);
	})
	.delete((req, res, _) => {
		res.end('Deleting leader: ' + req.params.leaderId);
	});

module.exports = leaderRouter;
