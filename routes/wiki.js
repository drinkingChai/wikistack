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
		content: req.body.content,
		tags: req.body.tags
	})

	User.findOrCreate({
		where: {
			email: req.body.email
		}, defaults: {
			name: req.body.author	
		}
	}).then(user=> {
		return page.save().then(savedPage=> {
			return page.setUser(user[0]);
		});
		return page.save();
	}).then(savedPage=> {
		res.redirect(savedPage.route);
	}).catch(next);

})

router.get('/add', (req, res, next) => {
	res.render('addpage');
})

router.get('/search', (req, res, next)=> {
	Page.findByTag(req.query['tags']).then(pages=> {
		res.render('index', { pages });
	}, next);
})

router.get('/:urlTitle/similar', (req, res, next)=> {
	Page.findSimilar(req.params.urlTitle).then(pages=> {
		res.render('index', { pages });
	}, next);
})

router.get('/:urlTitle', (req, res, next) => {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		},
		include: [{
			model: User
		}]
	}).then(page=> {
		if (!page) return res.render('error', { message: 'Bad page', error: new Error('Bad page')});
		res.render('wikipage', { page, user: page.user });
	}, next)
})



module.exports = router;
