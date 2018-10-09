const express = require('express');
const router = express.Router();
var User = require('../Models/user.js'); //including model
var Book = require('../Models/Book.js'); //including model
var Category = require('../Models/Category.js'); //including model
var VerifyToken = require('../verifytoken'); //api middleware
var mv = require('mv');  //its for chokidar
var path = require('path');


router.get('/',function(req,res){
	Category.find({}).select("name _id").exec().then((results) => {
		res.status(200).json({ data: results });
	}).catch((err) => {
		res.status(400).json({ error: err });
	});
});
router.post('/',function(req,res){
	var newcat = new Category();
	newcat.name = req.body.name;
	newcat.save().then((results) => {
		res.status(200).json({ status: 'success', data: results });
	}).catch((err) => {
		res.status(400).json({ error: err });
	});
});


module.exports = router;