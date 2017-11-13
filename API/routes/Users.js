var express = require('express');
var router = express.Router();
//Database Connection
var db=require('../dbconnection');
var base64 = require('base-64');
var multer = require('multer');
var path = require('path');

router.get('/',function(req,res){
  db.query("SELECT * FROM users", function (err, result) {
    if (err) throw err;
   res.send(result);
  });
});

//Login Starts
router.post('/login',function(req,res){
	var tdata=req.body;
	var phoneno=tdata.phoneno;
	var password=tdata.password;
	password=base64.encode(password);
		var query="select u.uid,u.fname,u.lname,u.email,u.status,u.role from users u where u.phoneno='"+phoneno+"' and u.password='"+password+"'";
	
 db.query(query, function (err, result) {
  if(result.length>0){
	res.send(result[0]);
  }
  else{
 res.send(404); //if user not found
  }

  });
  
});
//Login Ends

router.get('/getalltasks',function(req,res){
  db.query("SELECT * FROM users", function (err, result) {
    if (err) throw err;
   res.send(result);
  });
});

/*Signup*/
router.post('/signup',function(req,res){
  tfname=req.body.fname;
  tlname=req.body.lname;
  temail=req.body.email;
  tphone=req.body.phone;
  
  tpassword=base64.encode(req.body.password);
  var CheckQuery="Select uid from Users where fname='"+tfname+"' and lname='"+tlname+"' and email='"+temail+"' and phoneno='"+tphone+"' ";
  db.query(CheckQuery,function(err,checkresult){ //console.log(checkresult==0);
    if(checkresult==0){
     
      var InsQuery="Insert Into users (fname,lname,email,password,phoneno,source,status,role) values ('"+tfname+"','"+tlname+"','"+temail+"','"+tpassword+"','"+tphone+"','Manual','Yes','U')";
      db.query(InsQuery,function(err,InsResult){
     res.json({Success:'SignUp Successfull'});
       });
    }
    else{
      res.json({Error:'Data Already Exists'});
     
    }
  }); 
  
});
/*SignUp Ends*/

/*SignIn*/
router.post('/Signin',function(req,res){
  temail=req.body.email;
  tpassword=base64.encode(req.body.password);
  var SignInQuery="Select concat(uid) as uid,fname,lname,email,phoneno,source,status,role,dob,gender,profile_img,facebook_profile from Users Where email='"+temail+"' and password='"+tpassword+"'";
  db.query(SignInQuery,function(err,result){
     //console.log(result==0);
    if(result==0){
      res.json({Error:'Invalid Credentials'});
    }
    else{res.json({Success:'SignIn Successfull',Data:result[0]});}
  });
});
/*SignIn Ends*/
//get user list for normal or vip user

router.get('/getuserlist', function (req, res) {
  var tdata = req.body;
  var role = tdata.role;
  var query = ("SELECT * FROM users where role='U'");
  db.query(query, function (err, res1) {
    if (err) {
      res.send(somethingwentwrong);
      return;
    }
    else {
      var query = ("SELECT * FROM users where role='V'");
      db.query(query, function (err, res2) {
        if (err) {
          res.send(somethingwentwrong);
          return;
        }
        else {
          res.send(success);
        }
      });
    }
    });
});

//post for change role 

router.post('/changeroles', function (req, res) {
  var tdata = req.body;
  var uid=tdata.uid;
  var role = tdata.role;
  var query = ("SELECT uid='"+uid+"' FROM users where role='U'");
  db.query(query, function (err, res1) {
    if (err) {
      res.send(somethingwentwrong);
      return;
    }
    else {
      var query = ("SELECT uid='"+uid+"' FROM users where role='V'");
      db.query(query, function (err, res2) {
        if (err) {
          res.send(somethingwentwrong);
          return;
        }
        else {
          res.send(success);
        }
      });
    }
    });
});

/*User Profile Image upload*/
var imagestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, req.headers.uid + path.extname(file.originalname))
  }
})
var uploadimage = multer({ storage: imagestorage })

router.post('/uploadimage', uploadimage.any(), function (req, res) {//For Single File Upload
  uid = req.headers.uid;
  var query = "Update  Users set profile_img='" + req.files[0].filename + "' where uid='" + uid + "'";
  db.query(query, function (err, result) {
    res.status(200).json({ Success: "File uploaded sucessfully." });
  });
});

/*User Profile Image Upload Ends*/
module.exports=router;