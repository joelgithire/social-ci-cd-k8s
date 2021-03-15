const mongoose = require("mongoose");

mongoose.set('useNewUrlParser',true);
mongoose.set('useUnifiedTopology',true);
mongoose.set('useFindAndModify',false);

class Database{

    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect('mongodb://127.0.0.1:27017/twitter');
        var db = mongoose.connection;

        db.on('error', console.error.bind(console, 'Connection Error:'));
        
        db.once('open', function() {
        console.log("Successfully connected to MongoDB!");
});
    }

}

module.exports = new Database();