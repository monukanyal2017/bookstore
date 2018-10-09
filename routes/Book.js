const express = require('express');
const router = express.Router();
var User = require('../Models/user.js'); //including model
var Book = require('../Models/Book.js'); //including model
var Category = require('../Models/Category.js'); //including model
var VerifyToken = require('../verifytoken'); //api middleware
var mv = require('mv');  //its for chokidar
var path = require('path');

router.get('/', function (req, res) {
	//req.userId
	Book.find({}).populate('Category', '_id name').exec().then((results) => {
		res.status(200).json({ data: results });
	}).catch((err) => {
		res.status(400).json({ error: err });
	});
});


router.post('/', function (req, res) {

	var newBook = new Book();
	newBook.User = req.body.user_id;
	newBook.Title = req.body.Title;
	newBook.Author = req.body.Author;
	newBook.Category = req.body.Category;
	newBook.save().then((results) => {
		res.status(200).json({ status: 'success', data: results });
	}).catch((err) => {
		res.status(400).json({ error: err });
	});
});


router.get('/:id', function (req, res) {

	Book.find({ _id: req.params.id }).exec().then((results) => {
		res.status(200).json({ data: results });
	}).catch((err) => {
		res.status(400).json({ err: err });
	});
});


router.put('/:id', VerifyToken, function (req, res) {
	var query = Book.findOneAndUpdate({ _id: req.params.id }, { $set: { Title: req.body.Title } }, { new: true });
	query.exec().then((results) => {
		res.status(200).json({ status: 'success', data: results });
	}).catch((err) => {

		res.status(400).json({ status: 'error', data: err });
	});

});


router.delete('/:id', function (req, res) {

	var query = Book.findOneAndRemove({ _id: req.params.id });
	query.exec().then((results) => {
		res.status(200).json({ data: results });
	}).catch((err) => {
		res.status(400).json({ error: err });
	});

});
//--------------------------------------------------------

router.post('/bookmeta', function (req, res) {
	var bookcover1 = req.files.bookcover1;
	var bookcover2 = req.files.bookcover2;
	var newBookmeta = new Bookmeta();
	newBookmeta.book_id = req.body.book_id;
	newBookmeta.bookcover1 = req.files.bookcover1.name;
	newBookmeta.bookcover2 = req.files.bookcover2.name;
	newBookmeta.description = req.body.description;

	var destination1 = path.join('public/uploads/' + req.files.bookcover1.name);
	bookcover1.mv(destination1, function (err) {
		if (err)
			return res.status(500).json({ status: false, data: err });
	});
	var destination2 = path.join('public/uploads/' + req.files.bookcover2.name);
	bookcover2.mv(destination2, function (err) {
		if (err)
			return res.status(500).json({ status: false, data: err });
	});
	newBookmeta.save().then((results) => {

		res.status(200).json({ data: results });

	}).catch((err) => {
		res.status(400).json({ error: err });
	});
});


router.post('/mybooks', function (req, res) {

	Book.find().populate('User', 'Name email').exec().then((results) => {
		res.status(200).json({ data: results });
	}).catch((err) => {
		res.status(400).json({ error: err });
	});

});

module.exports = router;