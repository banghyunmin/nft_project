const cheerio = require('cheerio')
const request = require('request')
const fs = require('graceful-fs')

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

module.exports = function() {
	const options = {
		url: "http://howrare.is/drops"
	}

	request(options, function(error, response, body) {
		const $ = cheerio.load(body)
		const $trs = $('div.all_coll_row')
		const data = []

		var cnt = 1
		$trs.each(function(i, elem) {
			const $tds = $(this).find('div.all_coll_col')
			const line = [] 
			if(i > 1) {
				$tds.each(function(j, elem2) {
					//fs.appendFile("test.txt", line, (err) => console.log(err))
	
					if(j == 0) {
						line.push( $(this).find('img').attr('src') )
						line.push( $(this).find('span').text() )
					} else if(j == 1) {
						$links = $(this).find('a')
						line.link = []
						$links.each(function(k, elem3) {
							line.push( $(this).attr('href') )
						})
					} else if(j == 2) {
						line.push( removeSpace($(this).text()) )
					} else if(j == 3) {
						line.push( removeSpace($(this).text()) )
					} else if(j == 4) {
						line.push( removeSpace($(this).text()) )
					} else if(j == 5) {
						line.push( removeSpace($(this).text()) )
					} else if(j == 6) {
						line.push( removeSpace($(this).text() ))
					}
				})

				fs.appendFile('./test.txt', cnt + '\n')
				for(var i = 0; i < line.length; i++) {
					//var buf = new Buffer(line[i] + '\n')
					fs.appendFile('./test.txt', line[i] + '\n')
				}
				fs.appendFile('./test.txt', '\n')
				cnt++

				//data.push(line)
				//fs.appendFile("test.txt", line, (err) => console.log(err))
			}
		})
		console.log('File Write Complete!')
		//return data
		//fs.writeFile('test.txt', data, 'utf8', function(err) {
		//	console.log('write complete')
		//})
	})
}
