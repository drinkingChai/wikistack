const router = require('express').Router();
const models = require('../models');
const toMarked = require('to-markdown');
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
	res.render('addpage', { page: {}, user: {}, method: '' });
})

router.get('/search', (req, res, next)=> {
	Page.findByTag(req.query['tags']).then(pages=> {
		res.render('index', { pages });
	}, next);
})

router.get('/:urlTitle/similar', (req, res, next)=> {
	Page.findOne({
		attributes: ['tags'],
		where: { urlTitle: req.params.urlTitle }
	}).then(page => {
		return page.findSimilar(req.params.urlTitle, page.tags);
	}).then(pages => {
		res.render('index', { pages });
	}).catch(next);
})

router.get('/:urlTitle/edit', (req, res, next) => {
	Page.findOne({
		where: {
			urlTitle: req.params.urlTitle
		},
		include: [{
			model: User
		}]
	}).then(page=> {
		if (!page) return res.render('error', { message: 'Bad page', error: new Error('Bad page')});
		page.content = toMarked(page.content);
		res.render('addpage', { page, user: page.user, method: `${req.params.urlTitle}?_method=PUT` });
	}, next)
})

router.put('/:urlTitle', (req, res, next) => {
	// don't need to hold previous data
	// the urlTitle can give the association ;)
	Page.findOne({
		where: { urlTitle: req.params.urlTitle },
		include: [{
			model: User
		}]
	}).then(page=> {
		return page.update({
			title: req.body.title,
			content: req.body.content,
			tags: req.body.tags
		}).then(updatedPage=> {
			page.user.update({
				name: req.body.author,
				email: req.body.email
			}).then(()=> {
				res.redirect(updatedPage.route);
			})
		});
	}).catch(next);
})

router.get('/:urlTitle/delete', (req, res, next) => {
	// get request for delete :o
	Page.findOne({
		where: { urlTitle: req.params.urlTitle }
	}).then(page=> {
		page.destroy();
	}).then(()=> {
		res.redirect('/wiki');
	}).catch(next);
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
