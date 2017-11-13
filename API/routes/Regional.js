var express = require('express');
var router = express.Router();
//Database Connection
var db = require('../dbconnection');

var somethingwentwrong={
"Message":"Something went wrong"	
};




//Getting pollcategory
router.get('/getVideos',function(req,res){
  db.query("select v.id,v.url,v.name,v.status,v.likes,v.dislikes from videos v",
  function (err, result) {
    if (err) throw err;
   res.send(result);
  });
});




module.exports = router;