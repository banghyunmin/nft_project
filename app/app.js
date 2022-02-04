const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express();

const corsOptions = {
  credentials: true
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/users', require('./api/users'));
app.use('/schedules', require('./api/schedules'));
app.use('/guides', require('./api/guides'));
app.use('/projects', require('./api/projects'));
app.use('/static', express.static(__dirname+'/api/schedules/public'));
app.use('/static2', express.static(__dirname+'/api/projects/public'));

module.exports = app;
