const projects = require('../../models/projects');
const bcrypt = require('bcrypt')
const config = require('../../config/environment');
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')








//==================================//
//                                  //
//          Project API
//                                  //
//==================================//
exports.projectIndex = (req, res) => {
    const query = `
	select a.id, a.name, b.weblink, b.twitlink, b.discordlink, b.price, b.high_price, c.image
	from projects as a
	left outer join project_infos as b on a.id = b.proj_id
	left outer join project_images as c on a.id = c.proj_id;
    `

    projects.sequelize.query(query)
    .then((firstRes) => {
      const query2 = `
	select a.id, b.category, b.date, b.time, b.count
	from projects as a
	left outer join project_schedules as b on a.id = b.proj_id;
      `

      projects.sequelize.query(query2)
      .then((secondRes) => {
	//return res.status(200).json([firstRes[0], secondRes[0]])
	const result = refactoring([firstRes[0], secondRes[0]])
	return res.status(200).json(result.datas.slice(result.index))
      })
    }).catch(err => {
      return res.status(200).json(err);
    })
};
exports.projectIndexAll = (req, res) => {
    const query = `
	select a.id, a.name, b.weblink, b.twitlink, b.discordlink, b.price, b.high_price, c.image
	from projects as a
	left outer join project_infos as b on a.id = b.proj_id
	left outer join project_images as c on a.id = c.proj_id;
    `

    projects.sequelize.query(query)
    .then((firstRes) => {
      const query2 = `
	select a.id, b.category, b.date, b.time, b.count
	from projects as a
	left outer join project_schedules as b on a.id = b.proj_id;
      `

      projects.sequelize.query(query2)
      .then((secondRes) => {
	//return res.status(200).json([firstRes[0], secondRes[0]])
	const result = refactoring([firstRes[0], secondRes[0]])
	return res.status(200).json(result.datas)
      })
    }).catch(err => {
      return res.status(200).json(err);
    })
};

const getNowDate = () => {
  var today = new Date();

  var year = today.getFullYear();
  var month = ('0' + (today.getMonth() + 1)).slice(-2);
  var day = ('0' + today.getDate()).slice(-2);

  var dateString = year + '-' + month  + '-' + day;

  return dateString
}
const refactoring = (json) => {
  var results = []
  var line = {}
  line.image = []
// image process
  json[0].sort((a,b) => {
    if(a.id < b.id) return -1
    if(a.id == b.id) return 0
    if(a.id > b.id) return 1
  })
  for(var i = 0; i < json[0].length; i++) {
    var elem = json[0][i]
    line.schedule = []
    line.id = elem.id
    line.name = elem.name
    line.weblink = elem.weblink
    line.twitlink = elem.twitlink
    line.discordlink = elem.discordlink
    line.price = elem.price
    line.high_price = elem.high_price
    line.image.push(elem.image)
    if(results.length > 0 && results[results.length - 1].id == line.id) {
      results[results.length-1].image.push(line.image[0])
    } else {
      results.push(line)
    }
    line = {}
    line.image = []
  }
// schedule process
  for(var i = 0; i < json[1].length; i++) {
    var elem = json[1][i]
    for(var j = 0; j < results.length; j++) {
      if(results[j].id == elem.id) results[j].schedule.push(elem)
    }
  }
// reprocess
  const NowDate = getNowDate()
  for(var i = 0; i < results.length; i++) {
    var elem = results[i]
    var cnt = 0
    var idx = 0
    for(var j = 0; j < elem.schedule.length; j++) {
      cnt += parseInt(elem.schedule[j].count, 10)

      if(NowDate < elem.schedule[j].date && elem.schedule[j].date < elem.schedule[0].date) idx = j
    }
    
    results[i].category = elem.schedule[idx].category
    results[i].date = elem.schedule[idx].date
    results[i].time = elem.schedule[idx].time
    results[i].count = cnt
  }


  var answer = results.sort((a,b) => {
	  if(a.date > b.date) return 1
	  if(a.date == b.date) return 0
	  if(a.date < b.date) return -1
  })
  var ans_idx = 0
  for(var i = 0; i < answer.length; i++) {
    const elem = answer[i]
    if(NowDate <= elem.date) {
	    ans_idx = i
	    break
    }
  }
//  return answer.slice(i)
  return {"datas" : answer, "index" : i}
}



















//==================================//
//                                  //
// Project && ProjectInfo CRUD
//                                  //
//==================================//
exports.projectCreate = (req, res) => {
    const name = req.body.name || '';
    const weblink = req.body.weblink || '';
    const twitlink = req.body.twitlink || '';
    const discordlink = req.body.discordlink || '';
    const price = req.body.price || '';
    const high_price = req.body.high_price || '';
    if(!name.length) return res.status(400).json({err: 'Incorrect Input'})

    projects.Project.create({
      name: name
    }).then((project) => {
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
    }).catch((err) => {
      return res.status(400).json({error: "fail create"})
    })
};
exports.projectShow = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(!id) return res.status(400).json({err: 'Incorrect id'});

    const query = `
	select a.id, a.name, b.weblink, b.twitlink, b.discordlink, b.price, b.high_price, c.image
	from (select x.id, x.name from projects as x where x.id = `+id+` ) as a
	left outer join project_infos as b on a.id = b.proj_id
	left outer join project_images as c on a.id = c.proj_id;
    `

    projects.sequelize.query(query)
    .then((firstRes) => {
      const query2 = `
	select a.id, b.category, b.date, b.time, b.count
	from (select x.id, x.name from projects as x where x.id = `+id+` ) as a
	left outer join project_schedules as b on a.id = b.proj_id
	where a.id = `+id+`;
      `

      projects.sequelize.query(query2)
      .then((secondRes) => {
	//return res.status(200).json([firstRes[0], secondRes[0]])
	const result = refactoring([firstRes[0], secondRes[0]])
	return res.status(200).json(result.datas)
      })
    }).catch(err => {
      return res.status(200).json(err);
    })
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
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({error: 'Incorrect id'});

    projects.ProjectInfo.destroy({
      where:{proj_id:id}
    }).then(() => {
      projects.ProjectSchedule.destroy({
	where:{proj_id:id}
      }).then(() => {})
    }).then(() => {
      projects.ProjectImage.destroy({
	where:{proj_id:id}
      }).then(() => {})
    }).then(() => {
      projects.Project.destroy({
	where:{id:id}
      }).then(() => {
	res.status(204).send()
      })
    })
};

//==================================//
//                                  //
// ProjectImage CRUD
//                                  //
//==================================//
exports.imageCreate = (req, res) => {
    const image = req.file ? "http://180.228.243.235/static/images/"+req.file.filename : '';
    const id = parseInt(req.params.id, 10);
    if(!image.length || !id) {
      const words = image.split('/')
      fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	if(err) console.log("Error : ", err)
      })
      return res.status(400).json({err: 'Incorrect Input'})
    }
    projects.ProjectImage.create({
	proj_id: id,
	image: image
    })
    .then((schedule) => res.status(201).json(schedule))
    .catch((err) => {
      const words = image.split('/')
      fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	if(err) console.log("Error : ", err)
      })
    });
};
exports.imageIndex = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({error: 'Incorrect id'});

    projects.ProjectImage.findAll({
      where: {proj_id: id}
    }).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        return res.status(404).json({err: 'Undefined error!'});
    });
};
exports.imageShow = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const img = parseInt(req.params.img, 10);
    if(!id) return res.status(400).json({err: 'Incorrect id'});
    if(!img) return res.status(400).json({err: 'Incorrect img'});

    projects.ProjectImage.findOne({
        where: {
            proj_id: id,
	    id: img
        }
    }).then(project => {
        if(!project) return res.status(404).json({err: 'No Project!'});

	return res.json(project)
    });
};
exports.imageUpdate = (req, res) => {
    const image = req.file ? "http://180.228.243.235/static/images/"+req.file.filename : '';
    //const image = req.body.image || '';
    const id = parseInt(req.params.id, 10);
    const img = parseInt(req.params.img, 10);
    if (!id || !image.length || !img) {
      const words = image.split('/')
      fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	if(err) console.log("Error : ", err)
      })
      return res.status(400).json({err: 'Incorrect price'})
    }

    projects.ProjectImage.findOne({
        where: {
            proj_id: id,
	    id: img
        }
    }).then(project => {
      if(!project) {
        const words = image.split('/')
        fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	  if(err) console.log("Error : ", err)
        })
	return res.status(404).json({err: 'No Schedule'});
      }

      const words = project.image.split('/')
      fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	if(err) console.log("Error : ", err)
      })
      projects.ProjectImage.update(
        {
	  image: image,
	},
        {where: {proj_id: id, id: img}, returning: true})
	.then((updatedImage) => res.status(201).json(updatedImage))
        .catch(function(err) {
             //TODO: error handling
             return res.status(404).json({err: 'Undefined error!'});
      });
    });
}
exports.imageDelete = (req, res) => {
    // console.log("destory");
    const id = parseInt(req.params.id, 10);
    const img = parseInt(req.params.img, 10);
    if (!id || !img) {
        return res.status(400).json({error: 'Incorrect input'});
    }

    projects.ProjectImage.findOne({
        where: {
            proj_id: id,
	    id: img
        }
    }).then(project => {
        if(!project) return res.status(404).json({err: 'No Schedule'});

	const words = project.image.split('/')
	fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	  if(err) console.log("Error : ", err)
	})
	projects.ProjectImage.destroy({where: {proj_id: id, id: img}}).then(()=> res.status(204).send())
    });
};

//==================================//
//                                  //
// ProjectSchedule CRUD
//                                  //
//==================================//
exports.scheduleCreate = (req, res) => {
    const category = req.body.category || '';
    const date = req.body.date || '';
    const time = req.body.time || '';
    const count = req.body.count || '';
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({error: 'Incorrect input'});

    projects.Project.findOne({
      where: {id:id}
    }).then((project) => {
      if(!project) return res.status(400).json({error: 'No Project'});
	    
      projects.ProjectSchedule.create({
	proj_id: project.id,
        category: category,
        date: date,
        time: time,
        count: count
      })
      .then((project) => {
        if(!project) return res.status(400).json({error: "Incorrect Schedule"});

        res.status(201).json(project)
      });
    })
};
exports.scheduleIndex = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({error: 'Incorrect id'});

    projects.ProjectSchedule.findAll({
      where: {proj_id: id}
    }).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        return res.status(404).json({err: 'Undefined error!'});
    });
};
exports.scheduleShow = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const task = parseInt(req.params.task, 10);
    if (!id || !task) {
        return res.status(400).json({error: 'Incorrect input'});
    }

    projects.ProjectSchedule.findOne({
        where: {
            proj_id: id,
	    id: task
        }
    }).then(project => {
        if(!project) return res.status(404).json({err: 'No Project!'});

	return res.json(project)
    });
};
exports.scheduleUpdate = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const task = parseInt(req.params.task, 10);
    if (!id || !task) {
        return res.status(400).json({error: 'Incorrect input'});
    }
    const category = req.body.category || '';
    const date = req.body.date || '';
    const time = req.body.time || '';
    const count = req.body.count || '';

    projects.ProjectSchedule.update(
    {
        category: category,
        date: date,
        time: time,
        count: count
    },
    {where: {proj_id: id, id: task}, returning: true})
    .then((project) => {
      if(!project) return res.status(404).json({err: 'No Project!'});

      return res.json(project)
    });
}
exports.scheduleDelete = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const task = parseInt(req.params.task, 10);
    if (!id || !task) {
        return res.status(400).json({error: 'Incorrect input'});
    }

    projects.ProjectSchedule.destroy({
      where:{proj_id:id, id: task}
    }).then(() => {
      return res.status(204).send();
    }).catch((err) => {
      return res.status(400).json({error: "fail delete"});
    })
};









