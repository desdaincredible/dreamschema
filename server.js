const express = require('express');
const app = express();
const userController = require('./controllers/userController');
const dreamController = require('./controllers/dreamController');
const authController = require('./controllers/authController');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan');
const requireLogin = require('./middleware/requireLogin');
const showMessagesAndUsername = require('./middleware/showSessionMessages');
const Dream = require('./models/dreams');

app.use(session({
    secret: "sdflawiefuawi3ur487gbisub3w434",
    resave: false,
    saveUninitilized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('short'));
// app.use(requireLogin);
// app.use(showMessagesAndUsername);
require('./db/db');


// app.get('/', (req, res)=>{
//     res.render("auth/login.ejs");
// });

// SEARCH ROUTE
app.get('/search', (req, res) => {
    Dream.find(
      { $text: { $search: req.query.title } },
      { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .exec((err, matchingDreams) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(req.query.title);
          console.log(matchingDreams);
          res.render('search.ejs', {
            dreams: matchingDreams,
          });
        }
      });
  });

app.use('/users', userController);
app.use('/dreams', dreamController);
app.use('/auth', authController);

app.listen(3000, ()=>{
    console.log("server is go");
});

