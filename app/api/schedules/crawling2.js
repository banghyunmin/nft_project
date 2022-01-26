const cheerio = require('cheerio')
const request = require('request')

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
			$tds.each(function(j, elem2) {
				//const title = $(this).find('span').text()
				//if(title.length > 0) data.push(title)

				if(j == 0) {
					line.image = $(this).find('img').attr('src')
					line.name = $(this).find('span').text()
				} else if(j == 1) {
					$links = $(this).find('a')
					line.link = []
					$links.each(function(k, elem3) {
						line.link.push($(this).attr('href'))
					})
				} else if(j == 2) line.date = $(this).text()
				else if(j == 3) line.countdown = $(this).text()
				else if(j == 4) line.count = $(this).text()
				else if(j == 5) line.price = $(this).text()
				else if(j == 6) line.describe = $(this).text()
			})
			data.push(line)
		})

		console.log(data)
	})
}

crawling()
