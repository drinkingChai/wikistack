const router = require('express').Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

// GET 	/users/ 	get all users, do not change db
// GET 	/users/123 	get user 123, do not change db
// POST 	/users/ 	create a user in the db
// PUT 	/users/123 	update user 123 in the db
// DELETE 	/users/123

router.get('/', (req, res, next) => {
	User.findAll({}).then(users=> {
		res.render('users', { users });
	});
})

router.get('/:id', (req, res, next) => {
	Promise.all([
		Page.findAll({
			where: { userId: req.params.id }
		}),
		User.findOne({
			where: { id: req.params.id }
		})
	]).then(result=> {
		res.render('index', { pages: result[0], user: result[1] });
	}, next);
})

// router.post('/', (req, res, next) => {
	
// })

// router.put('/:id', (req, res, next) => {
	
// })

// router.delete('/:id', (req, res, next) => {
	
// })


module.exports = router;