const express = require('express');
const bodyParser = require('body-parser');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
	.get((_, res, next) => {
		Dishes.find({})
			.then((dishes) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'applicaton/json');
				res.json(dishes);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		Dishes.create(req.body)
			.then((dish) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'applicaton/json');
				res.json(dish);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.put((_, res, __) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /dishes');
	})
	.delete((_, res, next) => {
		Dishes.deleteMany({})
			.then((resp) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'applicaton/json');
				res.json(resp);
			}, (err) => next(err))
			.catch((err) => next(err));
	});

dishRouter.route('/:dishId')
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'applicaton/json');
				res.json(dish);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.post((req, res, _) => {
		res.statusCode = 403;
		res.end('POST operation not supported on /dishes/'
			+ req.params.dishId);
	})
	.put((req, res, next) => {
		Dishes.findByIdAndUpdate(
			req.params.dishId,
			{ $set: req.body },
			{ new: true },
		).then((dish) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'applicaton/json');
				res.json(dish);
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		Dishes.findByIdAndRemove(req.params.dishId)
			.then((resp) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'applicaton/json');
				res.json(resp);
			}, (err) => next(err))
			.catch((err) => next(err));
	});

dishRouter.route('/:dishId/comments')
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if (dish !== null) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'applicaton/json');
					res.json(dish.comments);
				} else {
					err = new Error('Dish ' + req.params.dishId + ' not found');
					err.status = 404;
					return next(err);
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if (dish !== null) {
					dish.comments = [...dish.comments, req.body];
					dish.save()
						.then((dish) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'applicaton/json');
							res.json(dish);
						}, (err) => next(err));
				} else {
					err = new Error('Dish ' + req.params.dishId + ' not found');
					err.status = 404;
					return next(err);
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.put((req, res, _) => {
		res.statusCode = 403;
		res.end('PUT operation not supported on /dishes/'
			+ req.params.dishId + '/comments');
	})
	.delete((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if (dish !== null) {
					[...dish.comments].forEach((comment) => {
						dish.comments.id(comment._id).remove();
					});
					dish.save()
						.then((dish) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'applicaton/json');
							res.json(dish);
						}, (err) => next(err));
				} else {
					err = new Error('Dish ' + req.params.dishId + ' not found');
					err.status = 404;
					return next(err);
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	});

dishRouter.route('/:dishId/comments/:commentId')
	.get((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'applicaton/json');
					res.json(dish.comments.id(req.params.commentId));
				} else if (dish === null) {
					err = new Error('Dish ' + req.params.dishId + ' not found');
					err.status = 404;
					return next(err);
				} else {
					err = new Error('Comment ' + req.params.commentId + ' not found');
					err.status = 404;
					return next(err);
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.post((req, res, next) => {
		res.statusCode = 403;
		res.end('POST operation not supported on /dishes/' + req.params.dishId
			+ '/comments/' + req.params.commentId);
	})
	.put((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
					if (req.body.rating) {
						dish.comments.id(req.params.commentId).rating = req.body.rating;
					}
					if (req.body.comment) {
						dish.comments.id(req.params.commentId).comment = req.body.comment;
					}

					dish.save()
						.then((dish) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'applicaton/json');
							res.json(dish.comments);
						}, (err) => next(err));
				} else if (dish === null) {
					err = new Error('Dish ' + req.params.dishId + ' not found');
					err.status = 404;
					return next(err);
				} else {
					err = new Error('Comment ' + req.params.commentId + ' not found');
					err.status = 404;
					return next(err);
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	})
	.delete((req, res, next) => {
		Dishes.findById(req.params.dishId)
			.then((dish) => {
				if (dish !== null && dish.comments.id(req.params.commentId) !== null) {
					dish.comments.id(req.params.commentId).remove();
					dish.save()
						.then((dish) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'applicaton/json');
							res.json(dish.comments);
						}, (err) => next(err));
				} else if (dish === null) {
					err = new Error('Dish ' + req.params.dishId + ' not found');
					err.status = 404;
					return next(err);
				} else {
					err = new Error('Comment ' + req.params.commentId + ' not found');
					err.status = 404;
					return next(err);
				}
			}, (err) => next(err))
			.catch((err) => next(err));
	});

module.exports = dishRouter;
