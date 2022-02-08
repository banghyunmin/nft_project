const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const multer = require('multer')
const upload = multer({
	dest: __dirname+'/public/images/',
})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const controller = require('./project.controller');

module.exports = router;

//==================================//
//
//    DATABASES CRUD APIs
//
//==================================//
