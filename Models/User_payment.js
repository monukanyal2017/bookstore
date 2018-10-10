var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserPaymentSchema=new Schema({
    Transaction_id:{type: String ,unique: true,index: true},
    order_detail:{ type : Array , "default" : [] },
    ReceivedAmount:{type: String},
    Receiver_msisdn:{type: String, index: true},
    createdAt: {type: Date,default: Date.now},   
});

module.exports=mongoose.model('UserPayment',UserPaymentSchema);