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
    app.listen(port, () => {
      console.log(chalk.blue(`\nlistening on port ${port}`));
      // test
      // models.Page.create({
      // 	title: "I'm a little    coconut, short, and stout",
      // 	content: 'stuff'
      // }).then(page => {
      // 	console.log(page.get('urlTitle'));
      // })
    })
  })
