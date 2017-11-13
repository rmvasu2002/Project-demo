var express = require('express');
var router = express.Router();
//Database Connection
var db = require('../dbconnection');

var somethingwentwrong={
"Message":"Something went wrong"	
};

var success={
	"Message":"Vip Topic Created Successfully"
};

/* GET Vip page. */
router.get('/', function(req, res, next) {
  res.send('Vip Chats');
});


//Create Vip Topic
router.post('/createviptopic', function(req, res) {
	var tdata = req.body;
   
   var topic = tdata.topic;
    var status = tdata.status;
    var cat_id = tdata.cat_id;
	var created_by=tdata.created_by;

    //Inserting main details to the vip_chats table
    var insertquery = "insert into vip_chats(topic,status,cat_id,created_by) values ('" + topic + "','" + status + "','" + cat_id + "','" + created_by +"') ";
    db.query(insertquery,
        function(err, result) {
            if (err) {
            res.send(somethingwentwrong);
				return;
            } else {
			
res.send(success);

            }
res.send(success);

        });

		


});




//Get all VIP topics
router.get('/getviptopics',function(req,res){
  db.query("select concat(vc.id)as id,vc.topic,vc.`status`,vc.cat_id,pc.category_name from vip_chats vc,poll_category pc where pc.categoryid=vc.cat_id", function (err, result) {
    if (err) throw err;
	var uarray;
	//Getting user array
	var vipquery="select concat(u.fname,' ', u.lname)as username,u.uid  from users u where u.role='V'";
	 db.query(vipquery, function (err, userarray) {
    if (err) throw err;
	uarray=userarray;
	
	var resarray=[];
	for(var i=0;i<result.length;i++){
	var tdata={
	"id":result[i].id,
	"topic":result[i].topic,
	"status":result[i].status,
	"cat_id":result[i].cat_id,
	"category_name":result[i].category_name,
	"users":uarray.length,
	"userdet":uarray
	}
	
	resarray.push(tdata);	
	}
	  res.send(resarray);
  });
  

  });
	//Ending user array
	
});




module.exports = router;