const {nanoid} = require('nanoid');
const router = require('express').Router();

const UserModel = require('../models/userModel');
const {checkSignedIn} = require('../controllers/auth');

router.get('/users', async(req, res) => {
    const users = await UserModel.find({});

    res.send(users);
});


router.post('/users/create', async(req, res) => {
    const {name, email, age, phoneNumber} = req.body;

    if (!name || !email || !age || !password) {
        res.send('Missing required information');
        return;
    }

    if (await UserModel.checkExists(email, phoneNumber)){
        res.send('A user with the email or phone number already exists.');
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
    
    res.send('User was created');
});

router.post('/login', async(req, res) => {
    let {email, password} = req.body;

    if (!await UserModel.checkExists(email)) {
        res.send('a user with this email doesn\'t exist');
        return;
    }  

    if (await UserModel.comparePassword(email, password)) {
        
        req.session.userID = nanoid();
        req.session.save();

        res.send('you are now logged in');
        return;
    }

    res.send('You have entered the wrong password')
});

router.get('/protected-route', checkSignedIn, (req, res) => {
    res.send('welcome to the protected page');
});


// router.post('/profile', checkSignedIn, async (req, res) => {
//     // renders profile page
//  });


module.exports = router;