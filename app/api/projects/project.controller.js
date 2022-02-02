const projects = require('../../models/projects');
const bcrypt = require('bcrypt')
const config = require('../../config/environment');
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

// Project && ProjectInfo CRUD
exports.projectCreate = (req, res) => {
    const name = req.body.name || '';
    const weblink = req.body.weblink || '';
    const twitlink = req.body.twitlink || '';
    const discordlink = req.body.discordlink || '';
    const price = req.body.price || '';
    const high_price = req.body.high_price || '';
    if(!name.length) return res.status(400).json({err: 'Incorrect Input'})

    projects.Project.findOne({
        where: {
            name: name
        }
    }).then(result => {
      if(result) return res.status(404).json({err: 'Already Exists'});

      projects.Project.create({
	name: name
      })
      .then((project) => {
	projects.ProjectInfo.create({
	  proj_id: project.id,
	  weblink: weblink,
	  twitlink: twitlink,
	  discordlink: discordlink,
	  price: price,
	  high_price: high_price
	})
	.then((info) => {
	  res.status(201).json([project, info])
	})
      })
    });
};
exports.projectIndex = (req, res) => {
    projects.Project.findAll()
    .then((result) => res.status(200).json(result));
};
exports.projectShow = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(!id) return res.status(400).json({err: 'Incorrect id'});

    projects.Project.findOne({
        where: {
            id: id
        }
    }).then(project => {
        if(!project) return res.status(404).json({err: 'No Project!'});

	return res.json(project)
    });
};
exports.projectUpdate = (req, res) => {
    const name = req.body.name || '';
    const weblink = req.body.weblink || '';
    const twitlink = req.body.twitlink || '';
    const discordlink = req.body.discordlink || '';
    const price = req.body.price || '';
    const high_price = req.body.high_price || '';
    const id = parseInt(req.params.id, 10);
    if(!id) return res.status(400).json({err: 'Incorrect id'});
    if(!name.length) return res.status(400).json({err: 'Incorrect Input'})

    projects.Project.update(
    {
      name: name
    },
    {where: {id: id}, returning: true})
    .then((project) => {
      console.log(project)
      if(!project) return res.status(404).json({err: 'No Project!'});

      return res.json(project)
    });
}
exports.projectDelete = (req, res) => {
    // console.log("destory");
    const id = req.params.id;
    if (!id) return res.status(400).json({error: 'Incorrect id'});

    projects.ProjectInfo.destroy({
      where:{proj_id:id}
    }).then(() => {
      projects.Project.destroy({
	where:{id:id}
      }).then(() => {
	res.status(204).send()
      })
    })
};
// ProjectImage CRUD
// ProjectSchedule CRUD









