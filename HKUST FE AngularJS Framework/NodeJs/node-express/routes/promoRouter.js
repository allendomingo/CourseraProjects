const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
	.all((_, res, next) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/plain');
		next();
	})
	.get((_, res, __) => {
		res.end('Will send all the promotions to you!');
	})
	.post((req, res, _) => {
		res.end('Will add the promotion: ' + req.body.name
			+ ' with details: ' + req.body.description);
	})
	.put((_, res, __) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /promotions');
	})
	.delete((_, res, __) => {
		res.end('Deleting all promotions');
	});

promoRouter.route('/:promoId')
	.get((req, res, _) => {
		res.end('Will send details of the promotion: '
			+ req.params.promoId + ' to you!');
	})
	.post((req, res, _) => {
		res.statusCode = 403;
		res.end('POST operation not supported on /promotions/'
			+ req.params.promoId);
	})
	.put((req, res, _) => {
		res.write('Updating the promotion: ' + req.params.promoId + '\n');
		res.end('Will update the promotion: ' + req.body.name
			+ ' with details: ' + req.body.description);
	})
	.delete((req, res, _) => {
		res.end('Deleting promotion: ' + req.params.promoId);
	});

module.exports = promoRouter;
