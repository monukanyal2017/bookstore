var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var BookSchema=new Schema({
    isbn:{type:String,unique:true},
    title:{type: String, unique: true,index: true},
    author:{type: String ,index: true},
    Category: [
        { type: mongoose.Schema.ObjectId, ref: 'Category' }
    ],
    page:{type: String, index: true},
    description:{type:String,index:true},
    published:{type:String},
    publisher:{type:String},
    bookcover:{type:String},
    createdAt: {type: Date, index: true,default: Date.now},   
});

module.exports=mongoose.model('Book',BookSchema);
