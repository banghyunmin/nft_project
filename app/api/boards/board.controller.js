const boards = require('../../models/boards');
const bcrypt = require('bcrypt')
const config = require('../../config/environment');
const cheerio = require('cheerio')
const request = require('request')
const fs = require('fs')



//==================================//
//                                  //
//          BOARD FUNCTION
//                                  //
//==================================//
const IncreaseHit = (board, id) => {
  boards.Board.update({
    hit: board.hit+1
  }, {
    where: {id: id}
  }).then((result) => {
  }).catch((err) => {
    console.log("IncreaseHit Err", err)
  })
}


//==================================//
//                                  //
//          BOARD API
//                                  //
//==================================//
// create
exports.boardCreate = (req, res) => {
    const title = req.body.title || '';
    const content = req.body.content || '';
    const user_id = req.body.user_id || '';
    const user_pw = req.body.user_pw || '';
    const update_date = req.body.update_date || '';
    if(!title.length
	    || !content.length
	    || !user_id.length 
	    || !user_pw.length) return res.status(400).json({err: 'Incorrect Input'})

    boards.Board.create({
      title: title,
      content: content,
      user_id: user_id,
      user_pw: user_pw,
      update_date: update_date
    }).then((result) => {
      return res.status(201).json(result);
    }).catch((err) => {
      return res.status(400).json(err, {error: "fail create"})
    })
};
// read All
exports.boardIndex = (req, res) => {
    boards.Board.findAll()
    .then((results) => {
      return res.status(200).json(results);
    }).catch(err => {
      return res.status(400).json(err);
    })
};
// read One
exports.boardShow = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(!id) return res.status(400).json({err: 'Incorrect id'});

    boards.Board.findOne({
      where: {id: id}
    }).then((result) => {
      IncreaseHit(result, id);
      return res.status(200).json(result);
    }).catch(err => {
      return res.status(400).json(err);
    })
};
// update
exports.boardUpdate = (req, res) => {
    const title = req.body.title || '';
    const content = req.body.content || '';
    const user_id = req.body.user_id || '';
    const user_pw = req.body.user_pw || '';
    const update_date = req.body.update_date || '';
    const id = parseInt(req.params.id, 10);
    if(!id || !title.length
	    || !content.length
	    || !user_id.length 
	    || !user_pw.length) return res.status(400).json({err: 'Incorrect Input'})

    boards.Board.update({
      title: title,
      content: content,
      user_id: user_id,
      user_pw: user_pw,
      update_date: update_date
    }, {
      where: {id: id}
    }).then((result) => {
      return res.status(201).json(result);
    }).catch((err) => {
      return res.status(400).json(err, {error: "fail update"})
    })
};
// delete
exports.boardDelete = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({error: 'Incorrect id'});

    boards.BoardReply.destroy({
      where:{board_id:id}
    }).then(() => {

      boards.BoardImage.destroy({
	where:{board_id:id}
      }).then(() => {}).catch((errI) => {
        res.status(400).json("delete image fail")
      })

    }).then(() => {

      boards.BoardLike.destroy({
	where:{board_id:id}
      }).then(() => {}).catch((errL) => {
        res.status(400).json("delete like fail")
      })

    }).then(() => {

      boards.Board.destroy({
	where:{id:id}
      }).then(() => {
	res.status(204).send()
      }).catch((errB) => {
        res.status(400).json("delete board fail")
      })

    }).catch((errR) => {
      res.status(400).json("delete reply fail")
    })
};




// create like
exports.likeCreate = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const user_id = req.body.user_id || '';
    if(!id || !user_id.length) return res.status(400).json({err: 'Incorrect Input'})

    boards.BoardLike.create({
      board_id: id,
      user_id: user_id
    }).then((result) => {
      return res.status(201).json(result);
    }).catch((err) => {
      return res.status(400).json(err, {error: "fail create"})
    })
};
// create reply
exports.replyCreate = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const content = req.body.content || '';
    const user_id = req.body.user_id || '';
    if(!id || !user_id.length 
	    || !content.length) return res.status(400).json({err: 'Incorrect Input'})

    boards.BoardReply.create({
      board_id: id,
      content: content,
      user_id: user_id
    }).then((result) => {
      return res.status(201).json(result);
    }).catch((err) => {
      return res.status(400).json(err, {error: "fail create"})
    })
};
// read replay
exports.replyIndex = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(!id) return res.status(400).json({err: 'Incorrect Input'})

    boards.BoardReply.findAll({
      where: {board_id: id}
    })
    .then((results) => {
      return res.status(200).json(results);
    }).catch(err => {
      return res.status(400).json(err);
    })
};
// image create
exports.imageCreate = (req, res) => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    const image = req.file ? "http://180.228.243.235/static/images/boards/"+req.file.filename : '';
    const id = parseInt(req.params.id, 10);
    if(!id || !image.length) {
      const words = image1.split('/')
      fs.unlink(__dirname + '/../schedules/public/images/boards/' + words[words.length - 1], function(err) {
	if(err) console.log("Error : ", err)
      })
      return res.status(400).json({err: 'Incorrect Input'})
    }

    boards.BoardImage.create({
	board_id: id,
	image: image
    })
    .then((result) => res.status(201).json(result))
    .catch((err) => {
      const words = image.split('/')
      fs.unlink(__dirname + '/../schedules/public/images/boards/' + words[words.length - 1], function(err) {
	if(err) console.log("Error : ", err);
      })
      return res.status(400).json(err);
    });
};
// image read
exports.imageIndex = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({error: 'Incorrect id'});

    boards.BoardImage.findAll({
      where: {board_id: id}
    }).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        return res.status(404).json({err: 'Undefined error!'});
    });
};
// image update
exports.imageUpdate = (req, res) => {
    const image = req.file ? "http://180.228.243.235/static/images/boards/"+req.file.filename : '';
    const id = parseInt(req.params.id, 10);
    const img = parseInt(req.params.img, 10);
    if (!id || !image.length || !img) {
      const words = image.split('/')
      fs.unlink(__dirname + '/../schedules/public/images/boards/' + words[words.length - 1], function(err) {
	if(err) console.log("Error : ", err)
      })
      return res.status(400).json({err: 'Incorrect inputs'})
    }

    boards.BoardImage.findOne({
        where: {
            board_id: id,
	    id: img
        }
    }).then(result => {
// 결과가 없다면 이번에 등록된 사진이 삭제
      if(!result) {
        const words = image.split('/')
        fs.unlink(__dirname + '/../schedules/public/images/boards/' + words[words.length - 1], function(err) {
	  if(err) console.log("Error : ", err)
        })
	return res.status(404).json({err: 'No Image'});
      }
// 결과가 있다면 저번에 등록된 사진이 삭제
      const words = project.image.split('/')
      fs.unlink(__dirname + '/../schedules/public/images/boards' + words[words.length - 1], function(err) {
	if(err) console.log("Error : ", err)
      })

      boards.BoardImage.update({
	image: image,
      }, {
	where: {board_id: id, id: img},
	returning: true
      }).then((updatedImage) => {
	res.status(201).json(updatedImage)
      }).catch((err) => {
	return res.status(404).json({err: 'Undefined error!'});
      });
    });
}


