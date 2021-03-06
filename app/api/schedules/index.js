const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const multer = require('multer')
const upload = multer({
	dest: __dirname+'/public/images/',
})

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const controller2 = require('./schedule.controller');
const controller = require('./project.controller');
const test = require('./test');

module.exports = router;




//==================================//
//                                  //
//          Project API
//                                  //
//==================================//
router.get('/test', test.test);
router.get('/test2', test.test2);
router.get('/', controller.projectIndex);
router.get('/getAll', controller.projectIndexAll);
// Project && ProjectInfo CRUD
router.post('/', controller.projectCreate);
router.get('/:id', controller.projectShow);
router.put('/:id', controller.projectUpdate);
router.delete('/:id', controller.projectDelete);
// ProjectImage CRUD
router.post('/:id/images/', upload.single('file'), controller.imageCreate);
router.get('/:id/images/', controller.imageIndex);
router.get('/:id/images/:img', controller.imageShow);
router.put('/:id/images/:img', upload.single('file'), controller.imageUpdate);
router.delete('/:id/images/:img', controller.imageDelete);
// ProjectSchedule CRUD
router.post('/:id/schedules/', controller.scheduleCreate);
router.get('/:id/schedules/', controller.scheduleIndex);
router.get('/:id/schedules/:task', controller.scheduleShow);
router.put('/:id/schedules/:task', controller.scheduleUpdate);
router.delete('/:id/schedules/:task', controller.scheduleDelete);
// ProjectBest CRUD
router.get('/:id/bests', controller.bestIndex);
router.get('/:trash/bests/:id', controller.bestShow);
router.delete('/:id/bests', controller.bestDelete);
router.post('/:id/bests', controller.bestCreate);




// (C) upload schedule
//router.post('/', upload.single('file'), controller.create);
// (R) read All schedules && One schedule
//router.get('/:id', controller.show);
//router.get('/', controller.index);
// (U) update schedule
//router.put('/:id', upload.single('file'), controller.update);
// (D) delete schedule
//router.delete('/:id', controller.destroy);

//router.post('/auto', controller.automation);
