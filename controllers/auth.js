// const router = require('../routes/router');
const SessionModel = require('../models/sessionModel');

exports.checkSignedIn = (async(req, res, next) => {
    if (await SessionModel.checkSession(req.session.userID)) {
        next();
        return;
    }
    
    res.send('you must login to access this page');
});
