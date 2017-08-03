const router = require('express').Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;


router.get('/', (req, res, next) => {
	res.redirect('/');
})

router.post('/', (req, res, next) => {
	var page = Page.build({
		title: req.body.title,
		content: req.body.content
	})

	page.save().then(() => {
		res.json(page);
		// res.redirect('/');
	}, err=> {
		next(err);
	})
})

router.get('/add', (req, res, next) => {
	res.render('addpage');
})


module.exports = router;