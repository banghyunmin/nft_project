const projects = require('../../models/projects');



const query = `
select b.id as proj_id, a.* from schedules as a
left outer join projects as b on a.name = b.name;
`

projects.sequelize.query(query)
.then((results) => {

for(var i = 0; i < results[0].length; i++) {
  var elem = results[0][i]

//      projects.ProjectSchedule.create({
//	proj_id: elem.proj_id,
//	date: elem.date,
//	count: elem.count
//      })
//      .then(() => {
//      }).catch((err) => {
//	console.log(err)
//      })

//      projects.ProjectImage.create({
//	proj_id: elem.proj_id,
//	image: elem.image
//      })
//      .then(() => {
//      }).catch((err) => {
//	console.log(err)
//      })

      projects.ProjectInfo.create({
	proj_id: elem.proj_id,
	weblink: elem.weblink,
	twitlink: elem.twitlink,
	discordlink: elem.discordlink,
	price: elem.price,
	high_price: elem.high_price
      })
      .then(() => {
      }).catch((err) => {
	console.log(err)
      })

}

}).catch(err => {
	console.log(err)
})
