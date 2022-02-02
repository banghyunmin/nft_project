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
    name: Sequelize.STRING,
});
Project.associate = models => {
  Project.hasOne(models.ProjectInfo, {foreignKey: "projectId"});
  Project.hasMany(models.ProjectImage, {foreignKey: "projectId"});
  Project.hasMany(models.ProjectSchedule, {foreignKey: "projectId"});
}
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
ProjectInfo.associate = models => {
  ProjectInfo.belongsTo(models.Project, {foreignKey: "id"});
}
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
    count: Sequelize.STRING
});
ProjectSchedule.associate = models => {
  ProjectSchedule.belongsTo(models.Project, {foreignKey: "id"});
}
const ProjectImage = sequelize.define('project_image', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    proj_id: Sequelize.INTEGER,
    image: Sequelize.STRING
});
ProjectImage.associate = models => {
  ProjectImage.belongsTo(models.Project, {foreignKey: "projectId", sourceKey: "id"});
}

module.exports = {
    sequelize: sequelize,
    Project: Project,
    ProjectInfo: ProjectInfo,
    ProjectSchedule: ProjectSchedule,
    ProjectImage: ProjectImage
}
