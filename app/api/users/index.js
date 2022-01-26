const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const controller = require('./user.controller');
const { verifyToken } = require('../../middlewares/authorization');
console.log("TOKEN::: ", verifyToken)

module.exports = router;

router.get('/', controller.index);

// (C) signup
router.post('/', controller.create);
// (R) signin / logout
router.post('/:name', controller.show);
//router.get('/:name', verifyToken, controller.logout);
// (U) update
router.put('/:name', verifyToken, controller.update);
// (D) remove account
router.delete('/:name', verifyToken, controller.destroy);

