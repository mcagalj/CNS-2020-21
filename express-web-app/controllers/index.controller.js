const globals = rootRequire('globals');
const User = rootRequire('models/user');

exports.index = (req, res, next) => {	
	// Find and return a user, but exclude salt, password and _id fields
	User.findOne({username: req.username}, {_id:0, password: 0, salt: 0 })
		.then((user) => {	
			if (!user) {
				const err = Error(`Requested user "${req.username}" does not exist`);
				err.code = 'EUSERFAILURE';
				return next(err);
			}

			if (!req.csrfToken) {
				const err = Error(`Missing csrfToken function`);
				err.code = 'ESERVER';
				return next(err);				
			}

			res.render('index', { user: user, csrfToken: req.csrfToken() });
		})
		.catch(err => {
			err.code = 'EDATABASE';        
			return next(err);
		});
};