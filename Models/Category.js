var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var Categoryschema=new Schema({
    name:{type:String,unique:true},
    createdAt: {type: Date, index: true,default: Date.now},   
});

module.exports=mongoose.model('Category',Categoryschema);
