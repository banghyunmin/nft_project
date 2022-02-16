const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const multer = require('multer')
const upload = multer({
	dest: __dirname+'/../schedules/public/guides/',
})
const controller = require('./guide.controller');

module.exports = router;

router.get('/auto', controller.automation);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', upload.single('file'), controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);
