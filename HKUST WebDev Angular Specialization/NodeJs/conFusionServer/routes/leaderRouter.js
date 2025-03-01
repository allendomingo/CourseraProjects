const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
	.options(cors.corsWithOptions, (_, res) => { res.sendStatus = 200 })
	.get(cors.cors, (_, res, next) => {
		Leaders.find({})
			.then((leaders) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'applicaton/json');
				res.json(leaders);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Leaders.create(req.body)
				.then((leader) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'applicaton/json');
					res.json(leader);
				}, (err) => next(err))
				.catch((err) => next(err));
		},
	)
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(_, res, __) => {
			res.statusCode = 403;
			res.end('PUT operation not supported on /leaders');
		},
	)
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(_, res, next) => {
			Leaders.deleteMany({})
				.then((resp) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'applicaton/json');
					res.json(resp);
				}, (err) => next(err))
				.catch((err) => next(err));
		},
	);

leaderRouter.route('/:leaderId')
	.options(cors.corsWithOptions, (_, res) => { res.sendStatus = 200 })
	.get(cors.cors, (req, res, next) => {
		Leaders.findById(req.params.leaderId)
			.then((leader) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'applicaton/json');
				res.json(leader);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, _) => {
			res.statusCode = 403;
			res.end('POST operation not supported on /leaders/'
				+ req.params.leaderId);
		},
	)
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Leaders.findByIdAndUpdate(
				req.params.leaderId,
				{ $set: req.body },
				{ new: true },
			).then((leader) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'applicaton/json');
					res.json(leader);
				}, (err) => next(err))
				.catch((err) => next(err));
		},
	)
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		authenticate.verifyAdmin,
		(req, res, next) => {
			Leaders.findByIdAndRemove(req.params.leaderId)
				.then((resp) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'applicaton/json');
					res.json(resp);
				}, (err) => next(err))
				.catch((err) => next(err));
		},
	);

module.exports = leaderRouter;
