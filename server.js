const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');

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
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})
