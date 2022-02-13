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

const Board = sequelize.define('board', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
    user_id: Sequelize.STRING,
    user_pw: Sequelize.STRING,
    update_date: Sequelize.STRING,
    hit: {
	allowNull: false,
	type: Sequelize.INTEGER,
	defaultValue: 0
    }
});
const BoardImage = sequelize.define('board_image', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    board_id: Sequelize.INTEGER,
    image: Sequelize.STRING
});
const BoardLike = sequelize.define('board_like', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    board_id: Sequelize.INTEGER,
    user_id: Sequelize.STRING
});
const BoardReply = sequelize.define('board_reply', {
    id: {
	primaryKey: true,
	autoIncrement: true,
	type: Sequelize.INTEGER
    },
    board_id: Sequelize.INTEGER,
    user_id: Sequelize.STRING,
    content: Sequelize.STRING,
    update_date: Sequelize.STRING,
});

module.exports = {
    sequelize: sequelize,
    Board: Board,
    BoardImage: BoardImage,
    BoardLike: BoardLike,
    BoardReply: BoardReply
}
