const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const multer = require('multer')
const upload = multer({
	dest: __dirname+'/images/',
})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const controller = require('./schedule.controller');

module.exports = router;

// (C) upload schedule
router.post('/', upload.single('file'), controller.create);
// (R) read All schedules && One schedule
router.get('/:id', controller.show);
router.get('/', controller.index);
// (U) update schedule
router.put('/:id', controller.update);
// (D) delete schedule
router.delete('/:id', controller.destroy);

router.post('/auto', controller.automation);
