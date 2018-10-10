var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserPaymentSchema=new Schema({
    Transaction_id:{type: String ,unique: true,index: true},
    order_detail:{ type : Array , "default" : [] },
    shipping_details:{ type : Array , "default" : [] },
    Amount:{type: String},
    paymentstatus:{type:String},
    user_id:{type: String},
    createdAt: {type: Date,default: Date.now},   
});

module.exports=mongoose.model('UserPayment',UserPaymentSchema);