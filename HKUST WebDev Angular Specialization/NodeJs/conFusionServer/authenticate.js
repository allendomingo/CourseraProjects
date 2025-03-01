const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookTokenStrategy = require('passport-facebook-token');

const User = require('./models/user');
const config = require('./config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
	return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.secretKey,
};

exports.jwtPassport = passport.use(new JwtStrategy(
	opts,
	(jwt_payload, done) => {
		console.log('JWT payload:', jwt_payload);
		User.findOne({ _id: jwt_payload._id }, (err, user) => {
			if (err) {
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			}
			return done(null, false);
		});
	},
));

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, _, next) => {
	if (req.user.admin) {
		next();
	} else {
		const err = new Error('You are not authorized to perform this operation!');
		err.status = 403;
		next(err);
	}
};

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
	clientID: config.facebook.clientId,
	clientSecret: config.facebook.clientSecret,
}, (accesstoken, refreshToken, profile, done) => {
	User.findOne({ facebookId: profile.id }, (err, user) => {
		if (err) return done(err, false);
		if (!err && user !== null) return done(null, user);

		user = new User({ username: profile.displayName });
		user.facebookId = profile.id;
		user.firstname = profile.name.giveName;
		user.lastname = profile.name.familyName;
		user.save((err, user) => {
			if (err) return done(err, false);
			return done(null, user);
		});
	});

}));