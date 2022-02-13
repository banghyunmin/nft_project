const guides = require('../../models/guides');
const bcrypt = require('bcrypt')
const config = require('../../config/environment');

exports.index = (req, res) => {
    guides.Guide.findAll({
    }).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        //TODO: error handling
        return res.status(404).json({err: 'Undefined error!'});
    });
};

exports.show = (req, res) => {
    // console.log("show");
    const id = req.params.id || '';
    if(!id.length) return res.status(400).json({err: 'id'});

    guides.Guide.findOne({
        where: {
		id: id
        }
    }).then(guide => {
	if(!guide) return res.status(400).json({err: 'Incorrect ID'})
	res.status(200).json(guide)
    })
};

exports.update = (req, res) => {
    const image = req.body.image || '';
    const id = req.params.id || '';
    if(!id.length) return res.status(400).json({err: 'id'});
    const title = req.body.title || '';
    
    guides.Guide.update({
      image:image,
      title: title
    }, {
      where: {id: id}
    }).then((guide) => res.status(201).json(guide));
};

exports.create = (req, res) => {
    // console.log("create");
    const image = req.body.image || '';
    const title = req.body.title || '';
    
    guides.Guide.create({
      image: image,
      title: title,
    }).then((guide) => res.status(201).json(guide));
};

exports.destroy = (req, res) => {
    // console.log("destory");
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({error: 'Incorrect id'});
    }

    guides.Guide.destroy({where: {id:id}}).then(()=> res.status(204).send())
};

exports.automation = (req, res) => {
    guides.Guide.findAll().then(function(results) {
	results.forEach((res) =>{
	  console.log(res.dataValues)
	})
        res.json(results);
    }).catch(function(err) {
        //TODO: error handling
        return res.status(404).json({err: 'Undefined error!'});
    });
};
