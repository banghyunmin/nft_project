const schedules = require('../../models/schedules');
const projects = require('../../models/schedules');
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
	return res.status(200).json(refactoring([firstRes[0], secondRes[0]]))
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
  for(var i = 0; i < results.length; i++) {
    var elem = results[i]
    var cnt = 0
    var idx = 0
    for(var j = 0; j < elem.schedule.length; j++) {
      cnt += parseInt(elem.schedule[j].count, 10)

      if(getNowDate() < elem.schedule[j].date && elem.schedule[j].date < elem.schedule[0].date) idx = j
    }
    
    results[i].category = elem.schedule[idx].category
    results[i].date = elem.schedule[idx].date
    results[i].time = elem.schedule[idx].time
    results[i].count = cnt
  }


  return results.sort((a,b) => {
	  if(a.date > b.date) return 1
	  if(a.date == b.date) return 0
	  if(a.date < b.date) return -1
  })
}







exports.index = (req, res) => {

    schedules.Schedule.findAll({
      order: [
	['date', 'ASC']
      ]
    }).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        //TODO: error handling
        return res.status(404).json({err: 'Undefined error!'});
    });
};


exports.show = (req, res) => {
    // console.log("show");
    const id = parseInt(req.params.id, 10);
    if(!id) return res.status(400).json({err: 'Incorrect id'});

    schedules.Schedule.findOne({
        where: {
            id: id
        }
    }).then(schedule => {
        if(!schedule) return res.status(404).json({err: 'No Schedule'});

	return res.json(schedule)
    });
};

exports.destroy = (req, res) => {
    // console.log("destory");
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({error: 'Incorrect id'});
    }

    schedules.Schedule.findOne({
        where: {
            id: id
        }
    }).then(schedule => {
        if(!schedule) return res.status(404).json({err: 'No Schedule'});
	const words = schedule.image.split('/')
	fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	  if(err) console.log("Error : ", err)
	})
	schedules.Schedule.destroy({where: {id:id}}).then(()=> res.status(204).send())
    });
};

function removeSpace(str) {
	var flag = false
	var ans = ''
	for(var i = 0; i < str.length; i++) {
		if(str[i] != ' ' && str[i] != '\n') flag = true
		if(flag == true && str[i] == '\n') break
		
		if(flag) ans += str[i]
		else continue
	}
	return ans
}

exports.create = (req, res) => {
    const image = req.file ? "http://180.228.243.235/static/images/"+req.file.filename : '';
    //const image = req.body.image || '';
    const name = req.body.name || '';
    const weblink = req.body.weblink || '';
    const twitlink = req.body.twitlink || '';
    const discordlink = req.body.discordlink || '';
    const date = req.body.date || '';
    const count = req.body.count || '';
    const price = req.body.price || '';
    const high_price = req.body.high_price || '';
    if(!image.length || 
       !name.length ||
       !date.length ||
       !count.length ||
       !price.length) {
      const words = image.split('/')
      fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	if(err) console.log("Error : ", err)
      })
      return res.status(400).json({err: 'Incorrect Input'})
    }
    schedules.Schedule.create({
	image: image,
	name: name,
	weblink: weblink,
	twitlink: twitlink,
	discordlink: discordlink,
	date: date,
	count: count,
	price: price,
	high_price: high_price
    })
    .then((schedule) => res.status(201).json(schedule))
    .catch((err) => {
      const words = image.split('/')
      fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	if(err) console.log("Error : ", err)
      })
    });

};

exports.update = (req, res) => {
    const image = req.file ? "http://180.228.243.235/static/images/"+req.file.filename : '';
    //const image = req.body.image || '';
    const name = req.body.name || '';
    const weblink = req.body.weblink || '';
    const twitlink = req.body.twitlink || '';
    const discordlink = req.body.discordlink || '';
    const date = req.body.date || '';
    const count = req.body.count || '';
    const price = req.body.price || '';
    const high_price = req.body.high_price || '';
    const id = req.params.id;
    if(image) {
      if(!id) return res.status(400).json({err: "Incorrect ID"})

      const words = image.split('/')
      fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	if(err) console.log("Error : ", err)
      })

      schedules.Schedule.update(
      {
	image: image
      },
      {where: {id: id}, returning: true})
      .then((schedule) => res.status(201).json(schedule))
      .catch(function(err) {
        const words = schedule.image.split('/')
        fs.unlink(__dirname +'/public/images/'+ words[words.length-1], function(err) {
	  if(err) console.log("Error : ", err)
        })

        return res.status(404).json({err: 'Undefined error!'});
      });
    } else {
      if (!id || 
      !name.length ||
      !date.length ||
      !count.length ||
      !price.length) {
        return res.status(400).json({err: 'Incorrect Inputs'})
      }

      schedules.Schedule.findOne({
        where: {
            id: id
        }
      }).then(schedule => {
        if(!schedule) return res.status(404).json({err: 'No Schedule'});

        schedules.Schedule.update(
        {
	  name: name,
	  weblink: weblink,
	  twitlink: twitlink,
	  discordlink: discordlink,
	  date: date,
	  count: count,
	  price: price,
	  high_price: high_price
	},
        {where: {id: id}, returning: true})
	.then((schedule) => res.status(201).json(schedule))
        .catch(function(err) {
             //TODO: error handling
             return res.status(404).json({err: 'Undefined error!'});
        });
      });
    }
}









exports.automation = (req, res) => {
	const options = {
		url: "http://howrare.is/drops"
	}

	const data = []
	request(options, function(error, response, body) {
		const $ = cheerio.load(body)
		const $trs = $('div.all_coll_row')

		var cnt = 1
		$trs.each(function(i, elem) {
			const $tds = $(this).find('div.all_coll_col')
			const line = [] 
			if(i > 1) {
				$tds.each(function(j, elem2) {
	
					if(j == 0) {
						line.image = $(this).find('img').attr('src')
						line.name = $(this).find('span').text()
					} else if(j == 1) {
						$links = $(this).find('a')
						line.link = []
						$links.each(function(k, elem3) {
							line.link.push($(this).attr('href'))
						})
					} else if(j == 2) line.date = removeSpace($(this).text())
					//else if(j == 3) line.countdown = removeSpace($(this).text())
					else if(j == 4) line.count = removeSpace($(this).text())
					else if(j == 5) line.price = removeSpace($(this).text())
					//else if(j == 6) line.describe = removeSpace($(this).text())
				})
    if(!line.image) {}
    else if(!line.name) {}
    else if(!line.link) {}
    else if(!line.count) {}
    else if(!line.price) {}
    else {

	    schedules.Schedule.create({
		image: line.image || '',
		name: line.name,
		weblink: line.link[0] || '',
		twitlink: line.link[1] || '',
		discordlink: line.link[2] || '',
		date: '2022-02-20',
		count: line.count,
		price: line.price || '',
		high_price: '1000 SOL',
	    }).then((schedule) => data.push(schedule)/*res.status(201).json(schedule)*/);

    }

			}
		})
	})
	res.status(201).json(data.length)
}
