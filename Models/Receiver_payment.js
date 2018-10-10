var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ReceiverPaymentSchema=new Schema({
    Transaction_id:{type: String ,unique: true,index: true},
    ReceivedAmount:{type: String},  
    paymentstatus:{type:String},
    Msisdn:{type: String},
    createdAt: {type: Date,default: Date.now},   
});

module.exports=mongoose.model('ReceiverPayment',ReceiverPaymentSchema);