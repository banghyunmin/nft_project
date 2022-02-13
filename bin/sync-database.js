const models = require('../app/models/models');
const schedules = require('../app/models/schedules');
const guides = require('../app/models/guides');
const projects = require('../app/models/projects');
const boards = require('../app/models/boards');
const config = require('../app/config/environment');

exports.board = () => {
    return boards.sequelize.sync({force: config.force});
}
exports.project = () => {
    return projects.sequelize.sync({force: config.force});
}
exports.guide = () => {
    return guides.sequelize.sync({force: config.force});
}
exports.schedule = () => {
    //console.log(schedules.sequelize.sync({force: config.force})); 
    return schedules.sequelize.sync({force: config.force});
}

exports.model = () => {
    //console.log(models.sequelize.sync({force: config.force})); 
    return models.sequelize.sync({force: config.force});
}
