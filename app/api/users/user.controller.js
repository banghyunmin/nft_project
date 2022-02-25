const models = require('../../models/models');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../../config/environment');

require('dotenv').config();

exports.index = (req, res) => {
    console.log(process.env.SECRET_KEY);
    models.User.findAll().then(function(results) {
        res.json(results);
    }).catch(function(err) {
        //TODO: error handling
        return res.status(404).json({err: 'Undefined error!'});
    });
};


exports.show = (req, res) => {
    // console.log("show");
    const name = req.params.name || '';
    if(!name.length) return res.status(400).json({err: 'Incorrect name'});
    const pw = req.body.pw || '';
    if(!pw.length) return res.status(400).json({err: 'Incorrect pw'});

    models.User.findOne({
        where: {
            name: name
        }
    }).then(user => {
        if(!user) return res.status(404).json({err: 'No User'});
	const same = bcrypt.compareSync(pw, user.pw)
	if(!same) return res.status(404).json({err: 'Incorrect Password'});
	
	const token = jwt.sign({
	    data: user.id
	}, config.env.SECRET_KEY, {
	    expiresIn: '1h'
	});
	res.cookie('user', token);
	console.log("cookie")
	res.status(201).json({
	    result: "ok",
	    token
	});
    });
};

exports.destroy = (req, res) => {
    // console.log("destory");
    const name = req.params.name;
    if (!name) {
        return res.status(400).json({error: 'Incorrect name'});
    }

    models.User.destroy({
        where: {
            name: name
        }
    }).then(() => res.status(204).send());
};

exports.create = (req, res) => {
    // console.log("create");
    console.log(req.body)
    const name = req.body.name || '';
    if(!name.length) return res.status(400).json({err: 'Incorrect name'})

    const pw = req.body.pw ||'';
    if(!pw.length) return res.status(400).json({err: 'Incorrect password'}) 
    const encryptPw = bcrypt.hashSync(pw, 10)
    
    models.User.findOne({
        where: {
            name: name
        }
    }).then(user => {
	if(user) return res.status(400).json({err: 'already exists'})
        models.User.create({
            name: name,
	    pw: encryptPw,
        }).then((user) => res.status(201).json(user));
    })

};

exports.update = (req, res) => {
    const newName = req.body.name || '';
    const newPw = req.body.pw || '';
    const name = req.params.name;

    if(!name.length) return res.status(400).json({err: 'Incorrect name'});
    if(!newName.length) return res.status(400).json({err: 'Incorrect new name'});
    if(!newPw.length) return res.status(400).json({err: 'Incorrect password'});
    const encryptPw = bcrypt.hashSync(newPw, 10)

    models.User.update(
        {name: newName, pw: encryptPw},
        {where: {name: name}, returning: true})
        .then(function(result) {
             res.json(result[1][0]);
        }).catch(function(err) {
             //TODO: error handling
             return res.status(404).json({err: 'Undefined error!'});
    });
}
