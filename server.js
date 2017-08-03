const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const models = require('./models');
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


app.get('/', (req, res, next) => {
  res.render('index');
})

const port = process.env.PORT || 3000;

models.db.sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.blue(`\nlistening on port ${port}`));
    })
  })
