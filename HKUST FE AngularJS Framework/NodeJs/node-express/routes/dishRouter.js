const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
	.all((_, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	.get((_, res, __) => {
		res.end('Will send all the dishes to you!');
	})
	.post((req, res, _) => {
		res.end('Will add the dish: ' + req.body.name
			+ ' with details: ' + req.body.description);
	})
	.put((_, res, __) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /dishes');
	})
	.delete((_, res, __) => {
		res.end('Deleting all dishes');
	});

dishRouter.route('/:dishId')
	.get((req, res, _) => {
		res.end('Will send details of the dish: '
			+ req.params.dishId + ' to you!');
	})
	.post((req, res, _) => {
		res.statusCode = 403;
		res.end('POST operation not supported on /dishes/'
			+ req.params.dishId);
	})
	.put((req, res, _) => {
		res.write('Updating the dish: ' + req.params.dishId + '\n');
		res.end('Will update the dish: ' + req.body.name
			+ ' with details: ' + req.body.description);
	})
	.delete((req, res, _) => {
		res.end('Deleting dish: ' + req.params.dishId);
	});

module.exports = dishRouter;
