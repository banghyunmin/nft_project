const models = require('../app/models/models');
const schedules = require('../app/models/schedules');
const config = require('../app/config/environment');

exports.schedule = () => {
    //console.log(schedules.sequelize.sync({force: config.force})); 
    return schedules.sequelize.sync({force: config.force});
}

exports.model = () => {
    //console.log(models.sequelize.sync({force: config.force})); 
    return models.sequelize.sync({force: config.force});
}
