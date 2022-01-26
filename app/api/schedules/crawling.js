const axios = require('axios')
const request = require('request-promise')
const cheerio = require('cheerio')

const url = "http://howrare.is/drops"

request(url).then( function(html) {
	const $ = cheerio.load(html)
	//const $articleList = $('div.all_coll_row').children('div.drop_links')
	const $articleList = $('div.all_coll_row')

	let newList = []
	$articleList.each(function(i, elem) {
		//newList[i] = $(this).text()
		
		const $subList = $(this)('div.all_coll_col')
		$subList.each(function(k, elem2) {
			subList[k] = $(this).text()
		})
		newList[i] = subList
	})
	//console.log($articleList.length)
	//console.log($articleList.html())
	console.log(newList)
})
