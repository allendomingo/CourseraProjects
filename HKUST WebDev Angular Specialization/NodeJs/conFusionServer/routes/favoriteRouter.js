const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Dishes = require('../models/dishes');
const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
	.options(cors.corsWithOptions, (_, res) => { res.sendStatus = 200 })
	.get(
		cors.cors,
		authenticate.verifyUser,
		(req, res, next) => {
			Favorites.findOne({ user: req.user._id })
				.populate('user')
				.populate('dishes')
				.then(favorite => {
					if (favorite === null) {
						Favorites.create({
							user: req.user._id,
							dishes: [],
						}).then(favorite => {
							Favorites.findOne({ user: favorite.user })
								.populate('user')
								.then(favorite => {
									res.statusCode = 200;
									res.setHeader('Content-Type', 'applicaton/json');
									res.json(favorite);
								}, (err) => next(err));
						});
					} else {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'applicaton/json');
						res.json(favorite);
					}
				}).catch((err) => next(err));
		},
	)
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		(req, res, next) => {
			Dishes.find({}).then(dishes => {
				const dishIds = dishes.map(dish => dish._id.toString());
				const missingDishes = req.body
					.map(dish => dish._id)
					.filter(dishId => !dishIds.includes(dishId));
				if (missingDishes.length > 0) {
					err = new Error(`Following dishes were not found: ${missingDishes.join(',')}`);
					err.status = 404;
					return next(err);
				}

				return Favorites.findOne({ user: req.user._id });
			}).then(favorite => {
				if (favorite === null) {
					return Favorites.create({
						user: req.user._id,
						dishes: req.body.map(dish => dish._id),
					});
				}
				favorite.dishes = [
					...favorite.dishes,
					...req.body
						.map(dish => dish._id)
						.filter(dishId => {
							return !favorite.dishes
								.map(dish => dish.toString())
								.includes(dishId);
						}),
				];
				return favorite.save();
			}).then(favorite => {
				if (favorite) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'applicaton/json');
					res.json(favorite);
				}
			}).catch((err) => next(err));
		},
	)
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		(_, res) => {
			res.statusCode = 403;
			res.end('PUT operation not supported on /favorites');
		},
	)
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		(req, res, next) => {
			Favorites.deleteOne({ user: req.user._id })
				.then((resp) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'applicaton/json');
					res.json(resp);
				}, (err) => next(err))
				.catch((err) => next(err));
		},
	);

favoriteRouter.route('/:dishId')
	.options(cors.corsWithOptions, (_, res) => { res.sendStatus = 200 })
	.get(
		cors.cors,
		authenticate.verifyUser,
		(req, res) => {
			res.statusCode = 403;
			res.end('GET operation not supported on /favorites/'
				+ req.params.dishId);
		},
	)
	.post(
		cors.corsWithOptions,
		authenticate.verifyUser,
		(req, res, next) => {
			Dishes.findById(req.params.dishId)
				.then(dish => {
					if (dish === null) {
						err = new Error('Dish ' + req.params.dishId + ' not found');
						err.status = 404;
						return next(err);
					}

					return Favorites.findOne({ user: req.user._id });
				}).then(favorite => {
					if (favorite === null) {
						return Favorites.create({
							user: req.user._id,
							dishes: [req.params.dishId],
						});
					} else if (!favorite.dishes
						.map(dishId => dishId.toString())
						.includes(req.params.dishId)
					) {
						favorite.dishes = [...favorite.dishes, req.params.dishId];
						return favorite.save();
					}
					res.statusCode = 200;
					res.setHeader('Content-Type', 'applicaton/json');
					res.json(favorite);
				}).then(favorite => {
					if (favorite) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'applicaton/json');
						res.json(favorite);
					}
				}).catch((err) => next(err));
		},
	)
	.put(
		cors.corsWithOptions,
		authenticate.verifyUser,
		(req, res) => {
			res.statusCode = 403;
			res.end('PUT operation not supported on /favorites/'
				+ req.params.dishId);
		},
	)
	.delete(
		cors.corsWithOptions,
		authenticate.verifyUser,
		(req, res, next) => {
			Dishes.findById(req.params.dishId)
				.then((dish) => {
					if (dish === null) {
						err = new Error('Dish ' + req.params.dishId + ' not found');
						err.status = 404;
						return next(err);
					}

					return Favorites.findOne({ user: req.user._id });
				}).then(favorite => {
					if (favorite === null) {
						return Favorites.create({
							user: req.user._id,
							dishes: [],
						});
					}
					favorite.dishes = favorite.dishes
						.filter(dishId => dishId.toString() !== req.params.dishId);
					return favorite.save();
				}).then(favorite => {
					if (favorite) {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'applicaton/json');
						res.json(favorite);
					}
				}).catch((err) => next(err));
		},
	);

module.exports = favoriteRouter;
