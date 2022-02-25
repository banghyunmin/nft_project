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

const Guide = sequelize.define('guide', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    title: Sequelize.STRING,
    content: Sequelize.STRING,
    image: Sequelize.STRING
});

module.exports = {
    sequelize: sequelize,
    Guide: Guide
}
