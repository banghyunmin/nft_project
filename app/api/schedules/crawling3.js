const cheerio = require('cheerio')
const request = require('request')

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

function crawling() {
	const options = {
		url: "http://howrare.is/drops"
	}

	request(options, function(error, response, body) {
		const $ = cheerio.load(body)
		const $trs = $('div.all_coll_row')
		const data = []

		$trs.each(function(i, elem) {
			const $tds = $(this).find('div.all_coll_col')
			const line = {}
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
					else if(j == 3) line.countdown = removeSpace($(this).text())
					else if(j == 4) line.count = removeSpace($(this).text())
					else if(j == 5) line.price = removeSpace($(this).text())
					else if(j == 6) line.describe = removeSpace($(this).text())
				})
				data.push(line)
			}
		})

		console.log(data)
		//return data
	})
}

crawling()
