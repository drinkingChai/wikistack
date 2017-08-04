const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const models = require('./models');
const routes = require('./routes');
const chalk = require('chalk');


const app = express();
app.set('view engine', 'html');
app.engine('html', nunjucks.render);
nunjucks.configure('views', {
  express: app,
  noCache: true
})


app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));


app.use(routes);
app.use((err, req, res, next) => {
	res.render('error', { message: err.message, error: err });
})


const port = process.env.PORT || 3000;

models.db.sync({ force: true, logging: false })
  .then(() => {
  	// some test pages
  	models.User.create({
  		name: 'John Smith',
  		email: 'john@john.com'
  	}).then(user=> {
	  	return models.Page.create({
	  		title: 'Test Page',
	  		content: 'Cool Stuff',
	  		tags: 'very cool stuff'
	  	}).then(page=> {
	  		page.setUser(user)
	  	}).then(() => {
	  		return models.Page.create({
		  		title: 'Test Page 2',
		  		content: 'Cool Stuff',
		  		tags: 'very awesome'
		  	})
	  	}).then(page=> {
	  		page.setUser(user)
	  	})
  	}).then(()=> {
	    app.listen(port, () => {
	      console.log(chalk.blue(`\nlistening on port ${port}`));
    	})
  	})
  })
