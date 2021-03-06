var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String,unique:true },
    email: { type: String, unique: true, index: true },
    mob:{type: String, unique: true, index: true},
    profilepicture:{type:String},
    password: { type: String },
    dob: { type: String },
    Book: [
        { type: mongoose.Schema.ObjectId, ref: 'Book' }
    ],
    OrderPayment:[
        { type: mongoose.Schema.ObjectId, ref: 'OrderPayment' }
    ],
    ReceiverPayment:[
        { type: mongoose.Schema.ObjectId, ref: 'ReceiverPayment' }
    ],
    createdAt: { type: Date, default: Date.now }
});
//UserSchema.index({email: 1, logintype: 1});
module.exports = mongoose.model('User', UserSchema);

