const config = require('../config/environment');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.username,
    config.mysql.password, {
        host: 'localhost',
        dialect: 'mysql'
    }
);

const Schedule = sequelize.define('schedule', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    image: Sequelize.STRING,
    name: Sequelize.STRING,
    weblink: Sequelize.STRING,
    twitlink: Sequelize.STRING,
    discordlink: Sequelize.STRING,
    date: Sequelize.STRING,
    count: Sequelize.STRING,
    price: Sequelize.STRING,
    high_price: Sequelize.STRING
});

module.exports = {
    sequelize: sequelize,
    Schedule: Schedule
}
