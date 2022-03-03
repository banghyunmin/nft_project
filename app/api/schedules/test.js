const projects = require('../../models/projects');
const Op = require('sequelize').Op;
const bcrypt = require('bcrypt')
const config = require('../../config/environment');
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')

exports.test = (req, res) => {
    const query = `
	select a.id, a.name, b.weblink, b.twitlink, b.discordlink, b.price, b.high_price
	from projects as a
	left outer join project_infos as b on a.id = b.proj_id
    `

    projects.ProjectSchedule.findAll({
      order: [
	['date', 'asc']
	     ],
      where: {
	date: {[Op.gte] : new Date(new Date() - 24 * 60 * 60 * 1000)}
      },
      limit: 100
    }).then((schedules) => {


      return res.status(200).json(schedules);
    }).catch(function(err) {
      return res.status(404).json({err: 'Undefined error!'});
    });

    
};
const makeJson = (results, images) => {
  for(var i = 0; i < results.length; i++) {
    results[i].image = []
  }
  for(var i = 0; i < images.length; i++) {
    for(var j = 0; j < results.length; j++) {
      if(results[j].proj_id == images[i].proj_id) {
	results[j].image.push(images[i].image)
	break;
      }
    }
  }

  return results
}
exports.test2 = (req, res) => {
  const query = `
	select *, s.price from (
	select * from project_schedules 
	where DATE_FORMAT(now(), '%Y-%m-%d') <= str_to_date(date, '%Y-%m-%d')
	order by date ASC) as s
	left outer join
	(select a.id, a.name, b.weblink, b.twitlink, b.discordlink, b.price, b.high_price
	from projects as a
	left outer join project_infos as b on a.id = b.proj_id) as line on line.id = s.proj_id
	order by s.date ASC
	`

  projects.sequelize.query(query)
  .then((results) => {

    projects.ProjectImage.findAll()
    .then((images) => {

      return res.status(200).json(makeJson(results[0], images));

    }).catch((erri) => {
      return res.status(400).json(erri);
    })

  }).catch((err) => {
    return res.status(400).json(err);
  })
}
