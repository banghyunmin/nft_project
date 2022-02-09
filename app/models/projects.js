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

const Project = sequelize.define('project', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    name: {
	unique: true,
	type: Sequelize.STRING
    }
});
const ProjectInfo = sequelize.define('project_info', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    proj_id: Sequelize.INTEGER,
    weblink: Sequelize.STRING,
    twitlink: Sequelize.STRING,
    discordlink: Sequelize.STRING,
    price: Sequelize.STRING,
    high_price: Sequelize.STRING
});
const ProjectSchedule = sequelize.define('project_schedule', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    proj_id: Sequelize.INTEGER,
    category: Sequelize.STRING,
    date: Sequelize.STRING,
    time: Sequelize.STRING,
    count: Sequelize.STRING,
    price: Sequelize.STRING,
    etc: Sequelize.STRING
});
const ProjectImage = sequelize.define('project_image', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    proj_id: Sequelize.INTEGER,
    image: Sequelize.STRING
});
const ProjectBest = sequelize.define('project_best', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    proj_id: Sequelize.INTEGER
});

module.exports = {
    sequelize: sequelize,
    Project: Project,
    ProjectInfo: ProjectInfo,
    ProjectSchedule: ProjectSchedule,
    ProjectImage: ProjectImage,
    ProjectBest: ProjectBest
}
