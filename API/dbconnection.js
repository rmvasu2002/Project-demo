var mysql=require('mysql');

/*  var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "demo"
});
*/

 var connection=mysql.createPool({
host:'54.183.143.178',
user:'myvoice',
password:'Aestas123',
database:'myvoice',
port:'3307'
}); 

module.exports=connection;