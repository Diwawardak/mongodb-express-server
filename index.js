const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const express = require('express');
require('dotenv').config();

const SessionModel = require('./models/sessionModel');
const router = require('./routes/router');

mongoose.connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true)

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.engine('.hbs', hbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}));

app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2, // 2 hours
        secure: false,
        sameSite: true
    }
}));

app.use(async (req, res, next) => {
    let loggedIn = await SessionModel.checkSession(req.session.userID);

    res.locals.loggedIn = loggedIn;

    return next();
});

app.use('/', router);

app.listen(3000, () => { // We need to tell express to listen for connections/ requests
    console.log('listening on port 3000');
});