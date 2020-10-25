const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const express = require('express');
const dotenv = require('dotenv').config()

const router = require('./routes/router');

const app = express();

mongoose.connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, //process.env.IN_PROD
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
}));


app.use('/', router);

app.listen(3000, () => {
    // process.env.PORT || == setting us up for deployment
    console.log('Server is listening.')
})