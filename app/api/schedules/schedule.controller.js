const schedules = require('../../models/schedules');
const bcrypt = require('bcrypt')
const config = require('../../config/environment');
const cheerio = require('cheerio')
const request = require('request')

exports.index = (req, res) => {

    schedules.Schedule.findAll().then(function(results) {
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

    schedules.Schedule.destroy({
        where: {
            id: id
        }
    }).then(() => res.status(204).send());
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
    // console.log("create");
    //const image = req.file.destination+req.file.filename;
    const image = req.body.image || '';
    const name = req.body.name || '';
    const weblink = req.body.weblink || '';
    const twitlink = req.body.twitlink || '';
    const discordlink = req.body.discordlink || '';
    const date = req.body.date || '';
    const count = req.body.count || '';
    const price = req.body.price || '';
    const high_price = req.body.high_price || '';
    if(!image.length) return res.status(400).json({err: 'Incorrect image'})
    if(!name.length) return res.status(400).json({err: 'Incorrect name'})
    if(!date.length) return res.status(400).json({err: 'Incorrect date'})
    if(!count.length) return res.status(400).json({err: 'Incorrect count'})
    if(!price.length) return res.status(400).json({err: 'Incorrect price'})


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
    }).then((schedule) => res.status(201).json(schedule));

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
