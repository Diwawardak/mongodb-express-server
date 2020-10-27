const {nanoid} = require('nanoid');
const router = require('express').Router();

const UserModel = require('../models/userModel');
const {checkSignedIn} = require('../controllers/auth');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/users', async(req, res)=> {
    const users = await UserModel.find({});
    res.send(users);
});

router.get('/signup', (req, res) => {
    res.render('signup') 
});

router.post('/signup', async(req, res) => {
    const {name, email, age, phoneNumber, password} = req.body;

    if (!name || !email || !age || !password) {
        res.render('signup', {err: 'Missing required information'});
        return;
    }

    if (await UserModel.checkExists(email, phoneNumber)) {
        res.render('signup', {err: 'A user with this email or phone number already exists'});
        return;
    }

    let hashedpassword = await UserModel.hashPassword(password);

    const user = new UserModel({
        name,
        age,
        email,
        phoneNumber,
        password: hashedpassword
    });

    user.save();

    req.session.userID = nanoid();
    req.session.save();

    res.redirect('profile');
});

router.get('/login', (req, res) => {
    res.render('login')
});

router.post('/login', async(req, res) => {
    let {email, password, username} = req.body;

    if (!await UserModel.checkExists(email)) {
        res.render('login', {err: 'A user with this email doesn\'t exist'});
        return;
    }

    if (await UserModel.comparePassword(email, password)) {
        console.log('login route triggered');

        req.session.userID = nanoid();
        req.session.save();

        res.redirect('/profile');
        return;
    }

    res.render('login', {err: 'You have entered the wrong password'});
});


router.get('/profile', checkSignedIn, (req, res) => {
    // console.log('profile route triggered');
    res.render('profile')
})

router.get('/logout', (req, res) => {
    req.session.destroy();

    res.redirect('/');
});

/*
Create route for admin page 
think about method(s) - GET, POST etc
think about protecting route
*/


module.exports = router;