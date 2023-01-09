var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema = new Schema( {
	
	
	name: String,
	email: String,
    passwd: String,
    passwdConf: String,
	dob: Date,
    gender: String,
	city: String,
	noHp: String,
	dateJoin: Date 
}),
User = mongoose.model('User', userSchema);

module.exports = User;