const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express();

app.use(
	cors({
		origin: ['http://180.228.243.235:3001'],
		credentials: true
	})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/users', require('./api/users'));
app.use('/schedules', require('./api/schedules'));

module.exports = app;
