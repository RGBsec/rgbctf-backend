const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const {
	Schema,
} = mongoose;

const fields = {
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
};

const user = new Schema(fields, {
	timestamps: true,
	toJSON: {
		virtuals: true,
	},
	toObject: {
		virtuals: true,
	},
});

const blacklistFields = ['password'];

user.methods.toJSON = function toJSON() {
	const doc = this.toObject();
	blacklistFields.forEach((field) => {
		if (Object.hasOwnProperty.call(doc, field)) {
			delete doc[field];
		}
	});
	return doc;
};

user.pre('save', function Save(next) {
	if (this.isNew || this.isModified('password')) {
		this.password = bcrypt.hashSync(this.password);
	}
	next();
});

user.methods.verifyPassword = function verifyPassword(password) {
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', user);
const {
      signToken,

} = require('../utils/auth');


exports.signup = (req, res, next) => {
	const {
		body,
	} = req;

	const user = new user(body);

	user.save()
		.then((created) => {
			const token = signToken({
				id: created.id,
			});

			res.json({
				success: true,
				item: created,
				meta: {
					token,
				},
			});
		})
		.catch((error) => {
			next(new Error(error));
		});
};

exports.profile = (req, res, next) => {
	const {
		decoded,
	} = req;
	const {
		id,
	} = decoded;

	User.findById(id)
		.then((user) => {
			res.json({
				success: true,
				item: user,
			});
		})
		.catch((error) => {
			next(new Error(error));
		});
};

exports.signin = (req, res, next) => {
	const {
		body,
	} = req;
	const {
		email,
		password,
	} = body;
	User
		.findOne({
			email,
		})
		.exec()
		.then((user) => {
			if (user && user.verifyPassword(password)) {
				const token = signToken({
					id: user.id,
				});
				res.json({
					success: true,
					item: user,
					meta: {
						token,
					},
				});
			} else {
				next();
			}
		})
		.catch((error) => {
			next(new Error(error));
		});
};

