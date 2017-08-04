const router = require('express').Router();


const nullcheck = (req, res, next)=> {
	var body = req.body;
	Object.keys(body).forEach(key=> {
		if (body[key].trim() == '') body[key] = null;
	})
	next();
}

router.use(nullcheck);
router.use('/wiki', require('./wiki'));
router.use('/users', require('./users'));
router.get('/search', (req, res, next)=> {
	res.render('search');
})

router.get('/', (req, res, next) => {
	res.render('index');
})

module.exports = router;