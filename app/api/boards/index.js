const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const multer = require('multer')
const upload = multer({
	dest: __dirname+'/public/images/boards/',
})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const controller = require('./board.controller');

module.exports = router;


//==================================//
//                                  //
//          Board API
//                                  //
//==================================//

// Board CRUD
router.post('/', controller.boardCreate);
router.get('/', controller.boardIndex);
router.get('/:id', controller.boardShow);
router.put('/:id', controller.boardUpdate);
router.delete('/:id', controller.boardDelete);
// Image CRU
router.post('/:id/images', upload.single('file'), controller.imageCreate);
router.get('/:id/images', controller.imageIndex);
router.put('/:id/images/:img', upload.single('file'), controller.imageUpdate);
// Like  C
router.post('/:id/like', controller.likeCreate);
// Reply CR
router.post('/:id/reply', controller.replyCreate);
router.get('/:id/reply', controller.replyIndex);
