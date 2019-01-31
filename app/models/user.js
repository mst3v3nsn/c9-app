var mongoose     = require('mongoose');
mongoose.Promise = global.Promise;

var Schema       = mongoose.Schema;

var userSchema   = new Schema({
        user         : {
	      username     : String,
        uidNum       : String,
        gidNum       : String,
        email        : String,
        password     : String,
	      name	       : String,
	      address      : String,
        homeDir      : String,
        pod          : String
}});

module.exports = mongoose.model('User', userSchema);
