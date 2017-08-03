const router = require('express').Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;


router.get('/', (req, res, next) => {
	Page.findAll({})
	.then(pages=> {
		res.render('index', { pages: pages });
	}, next);
})

router.post('/', (req, res, next) => {
	var page = Page.build({
		title: req.body.title,
		content: req.body.content
	})

	page.save().then((savedPage) => {
		// virtual route doesn't work?
		// console.log(`virtual route `, savedPage.route);
		res.redirect(`/wiki/${page.urlTitle}`);
	}, next);
})

router.get('/add', (req, res, next) => {
	res.render('addpage');
})

router.get('/:urlTitle', (req, res, next) => {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		}
	}).then(match=> {
		if (!match) return res.render('error', { message: 'Bad page', error: new Error('Bad page')});
		res.render('wikipage', { page: match });
	}, next)
})


module.exports = router;