var express = require('express');
var router = express.Router();
//Database Connection
var db = require('../dbconnection');
var multer = require('multer');
var path = require('path');
var somethingwentwrong={
"Message":"Something went wrong"	
};

var success={
	"Message":"Poll Created Successfully"
};



//Getting pollcategory
router.get('/PollCategory',function(req,res){
  db.query("SELECT concat(categoryid)as categoryid,category_name,cat_img_url,date_format(created_date,'%Y-%m-%d')as create_date,status FROM poll_category order by categoryid",
  function (err, result) {
    if (err) throw err;
   res.send(result);
  });
});

/*Creating Polls*/
router.post('/createPoll', function(req, res) {
 var tdata = req.body;
    var topic = tdata.topic;
    var status = 'Yes';
    var poll_catid = tdata.poll_catid;
    var start_date = tdata.start_date;
    var end_date = tdata.end_date;
  var created_by=tdata.created_by;
  var pollid;

   var CheckPollQuery="select pollid from polls where topic='"+topic+"' and poll_catid='"+poll_catid+"' and created_by='"+created_by+"'";
   db.query(CheckPollQuery,function(err,pollResult){ //console.log(pollResult==0);
       if(pollResult==0){ 
 //Inserting main details to the Polls table
 var insertquery = "insert into polls(topic,status,poll_catid,start_date,end_date,created_by) values ('" + topic + "','" + status + "','" + poll_catid + "','" + start_date + "','" + end_date + "','"+created_by+"') ";
 db.query(insertquery,function(err, result) {
         if (err) {res.send(somethingwentwrong);
             return;
         } else {
    pollid = result.insertId;
    tdata.pollid=pollid.toString();
             var options = tdata.options;
             for (var i = 0; i < options.length; i++) {
             var opt=options[i];
             var opt_ins_query="insert into poll_options(pollid,poll_option) values ('"+pollid+"','"+opt+"')";
             console.log(opt_ins_query);
             db.query(opt_ins_query, function (er, resp) {
             if (er){
             res.send(somethingwentwrong);
             return;
             }else{
                 
             }
            
           });
             }


         }
res.send(tdata);

     });
       }
       else{res.send('Data Already Exists');}
   });
   

  


});
/*Creating Polls Ends*/

//Get Polls
router.get('/getPolls',function(req,res){
  var resultarray=[];
  db.query("select p.pollid,p.topic,p.status,p.poll_catid,p.start_date,p.end_date,pc.category_name  from polls p,poll_category pc where p.poll_catid=pc.categoryid",
  function (err, result) {
    if (err){ throw err;
    }else{
   res.send(result);
    }
  });
});


//Get Poll details by id
router.get('/getPolldetails/:pollid',function(req,res){
  var pollid= req.params.pollid;
  var resultarray=[];
  db.query("select p.topic,p.`status`,p.start_date,p.end_date,p.poll_catid,pc.category_name, po.id,po.poll_option  from poll_options po,polls p,poll_category pc  where po.pollid='"+pollid+"' and po.pollid=p.pollid and pc.categoryid=p.poll_catid",
  function (err, result) {
    if (err){ throw err;
    }else{
    var tdata=result;
    var optionarray=[];
    var topic,status,start_date,end_date,poll_catid,category_name;
    for(var i=0;i<tdata.length;i++){
      if(i==0){
        topic=tdata[i].topic;
        status=tdata[i].status;
        start_date=tdata[i].start_date;
        end_date=tdata[i].end_date;
        poll_catid=tdata[i].poll_catid;
        category_name=tdata[i].category_name;
      }
      var poll_option=tdata[i].poll_option;
      var id=tdata[i].id;
      var opdata={
        "poll_option":poll_option,
        "id":id
      }
      optionarray.push(opdata);
    }
var resdata={
  "topic":topic,
  "status":status,
  "start_date":start_date,
  "end_date":end_date,
  "poll_catid":poll_catid,
  "category_name":category_name,
  "options":optionarray
}
   res.send(resdata);
    }
  });
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Videos/')
    },
    filename: function (req, file, cb) {
          cb(null, (Math.random().toString(36)+'00000000000000000').slice(2, 10) + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({ storage: storage })

 //Videos Upload

    router.post('/uploadvideos', upload.any(), function (req, res) {//For Single File Upload
        var filenameext = ((req.files[0].filename).split('.'));
        var tfilename = filenameext[0];

        var query = "Insert Into Videos (url,name,status) values('" + req.files[0].filename + "','" + tfilename + "','Yes')";
        db.query(query, function (err, result) {
            res.status(200).json({ Success: "File uploaded sucessfully." });
        });

    });
    //End Videos Upload

//Update Poll category Status
router.post('/Updatepollcategory',function(req,res){
 db.query("update poll_category set status='"+req.body.status+"' where  categoryid='"+req.body.categoryid+"'", function (resp,err, result) {

return res.status(200).json({Success:' Poll_Category Update Successfully'});
	
  
  });
});




//Pill Function
//Create Pill
router.post('/createPill',function(req,res){
    var cat_id=req.body.cat_id;
    var topic=req.body.topic;
    var description=req.body.description;
    var created_by=req.body.created_by;
    var status="Yes";

    var insquery="insert into pils (cat_id,topic,description,created_by,status) values ('"+cat_id+"','"+topic+"','"+description+"','"+created_by+"','"+status+"') ";
    console.log(insquery)
    db.query(insquery,function (err, result) {
      if (err){
        res.send(somethingwentwrong);   
      }else{
        return res.status(200).json({Success:' Pil Created Successfully'});
        
      }
     
    });
   });

   
//Getting pils
router.get('/getpils',function(req,res){
  db.query("select p.pillid,p.topic,p.description,p.status,p.cat_id,pc.category_name from pils p,poll_category pc where pc.categoryid=p.cat_id",
  function (err, result) {
    if (err) throw err;
   res.send(result);
  });
});

  // Function GetPollOPtions 
  function GetPollOptions(poll_id, callback) {
    var polloptionsquery = "select id,poll_option from poll_options where pollid='" + poll_id + "'";
    db.query(polloptionsquery, function (err, polloptionsresult) {
        callback(polloptionsresult);
    });
}
// End Function GetPollOPtions 

/*Getting Poll along with  Poll Category and POll Options*/
router.get("/GetPollWithOptions", function (req, res) {
    GetPoll(function (result) {
        console.log(result);
        res.send(result);
    });
});
/*Getting Poll along with  Poll Category and POll Options Ends*/

/*Getting POlls*/
function GetPoll(callback) {
    var pollarray = [];
    var pollquery = "select * from polls as p, poll_category as pc where p.poll_catid=pc.categoryid";
    db.query(pollquery, function (err, pollresult) {
        //console.log(pollresult);
        var i = 0;
        function GettingPollOpotions() {

            if (i < pollresult.length) {
                var poll_id = pollresult[i].pollid;
                GetPollOptions(poll_id, function (polloptionresult) {

                    //console.log(polloptionresult);
                    pollresult[i].Poll_Options = polloptionresult;
                    pollarray.push(pollresult[i]);

                    i = i + 1;
                    if (i == pollresult.length) {
                        callback(pollarray);
                    }

                    process.nextTick(GettingPollOpotions);

                })
            }
        }
        GettingPollOpotions();

    });
}
// Getting POlls Ends 

//Inserting POll Answer 
router.post('/PollAnswer', function (req, res) {

    var tpollid = req.body.poll_id;
    var tuserid = req.body.user_id;
    var tpollanswer = req.body.poll_option;
    var CheckPollOption="Select id From Poll_options where pollid='"+tpollid+"' and poll_option='"+tpollanswer+"'";
    db.query(CheckPollOption,function(err,polloptionresult){
    var pollOptionid=polloptionresult[0].id;
    
    var checkpollanswerquery = "Select id From Poll_Answer where pollid='" + tpollid + "' and userid='" + tuserid + "'";
    db.query(checkpollanswerquery, function (err, checkanserresult, fields) {

        if (checkanserresult == 0) {
            var pollanserquery = "Insert Into POll_Answer (Pollid,Userid,Pollanswer) Values('" + tpollid + "','" + tuserid + "','" + pollOptionid + "')";
            db.query(pollanserquery, function (err, answerresult) {
                if (err) { res.send(somethingwentwrong); return; }
                else {
                    res.json({Success:'Successfully Inserted !'});
                }
            })

        }
        else { res.send({Error:"Data Already Exists"}); }
    });
});
});
//Inserting POll Answer Ends 

/*Getting POll Option By User */
router.post('/PollOptionName', function (req, res) {
    var tpoll_id = req.body.poll_id;
    var tuser_id = req.body.user_id;

    var pollanswerquery = "select poll_option from poll_options where id=(Select pollanswer From Poll_Answer where pollid='" + tpoll_id + "' and userid='" + tuser_id + "')";
    db.query(pollanswerquery, function (err, checkanserresult) {
        if (checkanserresult == 0) { res.json({ Error: 'Data Not Present !' }); }
        else { res.json({ Success: "SuccessFull", Data: checkanserresult[0] }); }
    });
});
   /*Getting POll Option By User Ends*/
   
   
/* Poll Result*/
router.post('/PollResult', function (req, res) {
  ttopic = req.body.topic;

  var pollCountResult = [];
  var TopicQuery = "select p.pollid,p.topic,p.start_date,p.end_date,p.created_by,pc.category_name,p.poll_catid from polls as p join poll_category as pc on pc.categoryid=p.poll_catid where topic='" + ttopic + "' and p.status='Yes'";
  db.query(TopicQuery, function (err, topicresult) {  //getting the pollid from topics
    var pollid = topicresult[0].pollid;
    //var poll_categoryid(topicresult[0].poll_catid);
    if (topicresult == 0) { res.json('Invalid topic'); }
    else {
      /* var pollcategoryQuery="select category_name from poll_category where categoryid='"+poll_categoryid+"'";
      db.query() */
      var pollOptionQuery = "select * from poll_options where pollid='" + pollid + "'";
      db.query(pollOptionQuery, function (err, polloptionresult) {// getting all poll_options from pollid
        //console.log(polloptionresult);
        var pollasnwerid;
        var totalpoll = 0;
        var i = 0;
        function GettingPollAnswers() {

          if (i < polloptionresult.length) {
            pollasnwerid = polloptionresult[i].id;
            poll_option = polloptionresult[i].poll_option;
            //console.log(pollasnwerid);
            // console.log(pollid);
            var PollAnswerQuery = "select count(*) as pollcount from poll_answer where pollid='" + pollid + "' and pollanswer='" + pollasnwerid + "'";
            db.query(PollAnswerQuery, function (err, finalcountresult) { //console.log(finalcountresult);
              i = i + 1;
              finalcountresult[0].poll_option = poll_option;
              pollCountResult.push(finalcountresult[0]);
              totalpoll = totalpoll + finalcountresult[0].pollcount;
              // pollCountResult.push(poll_option);
              if (i == polloptionresult.length) {

                topicresult[0].poll_result = pollCountResult;
                topicresult[0].totalpollcount = totalpoll;
                res.json(topicresult[0]);
              }

              process.nextTick(GettingPollAnswers);

            });
          }
        }
        GettingPollAnswers();
      });

    }
  });
});
/*Poll Result Ends*/
module.exports = router;