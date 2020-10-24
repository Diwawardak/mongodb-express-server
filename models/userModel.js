// Schema - skeleton of what our document will look like 
// Like in a table 

const {Schema, model} = require('mongoose');
const bcrypt = require ('bcrypt');

const user = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    age: {type: Number, required: true},
    phoneNumber: {type: String, required: false, unique: true},
    password: {type: String, required: true}
});

user.statics.checkExists = async function (email, phoneNumber) {
    const exists = await this.exists({$or: [{email}, {phoneNumber}]});
    
    return exists;
}

user.statics.hashPassword = async function (password) {
    let hash = await bcrypt.hash(password, 12);

    return hash;
}

user.statics.comparePassword = async function (email, attemptedPassword) {
    let user = this.findOne({email}); 

    if (!user) {
        return false;
    }

    let result = bcrypt.compare(attemptedPassword, user.password);

    return result;
}

module.exports = model('users', user)


/*
signup 
password123 -> weh345jerh43r83rhh -> store in DB 
password123 -> jsdoqu3290jdoifh84 

md5
password123 -> jsdoqu3290jdoifh84 
password123 -> jsdoqu3290jdoifh84 

login
password123 -> hash -> weh345jerh43r83rhh
*/