var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;
var crypto = require("crypto");
var mongodb=require("mongodb")
var MongoClient = mongodb.MongoClient;

var MONGODB_URI ='mongodb://gigglescaptain:againrides!1@ds159988.mlab.com:59988/urlcntrctr';

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, '/views/index.html')) ) ;

app.get('/new/:url(*)', function(req, res) {
  var shortenme = req.params[0];
  var amItrue = validateURL(shortenme);
  if (amItrue){
    MongoClient.connect(MONGODB_URI,function(err,db){
          if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
          } else {
            console.log('Connection established to', MONGODB_URI);
            var shortenmeObj = yncryptyyn(shortenme);
            var short_url = shortenmeObj.key;;
            res.send({"url":shortenme,"key":short_url});
            db.collection("urlcntrctr").insertOne({"url":shortenme,"key":short_url});
          }
        })
}
  else{  //OK
    console.log("You need to enter a url, beginning with 'http' or 'https' and ending in '.com' or '.org' or whatever!");  //OK
    res.send("You need to enter a url, beginning with 'http' or 'https' and ending in '.com' or '.org' or whatever!");
  }  //OK
});  //OK

app.get('/:tag(*)', function(req, res) {
  var target = req.params.tag;

  var shortUrl="https://"+req.headers["x-forwarded-host"]+"/"+req.params.number
  MongoClient.connect(MONGODB_URI,function(err,db){
        if (err) {
          console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
          db.collection("urlcntrctr").find({"key":target},{"url":1,"_id":0}).toArray(function(err,docs){
            if(err) throw err
            var docslength = docs.length;
            if (docslength===0){res.send("Sorry, that does not match anything in our database!");}
            console.log(docslength);
            docs.map(function(item){
              var result=res.redirect(item.url)
              return result
            })
          })
        }
      })
});

function validateURL(textval) { //copied from http://stackoverflow.com/questions/1303872/trying-to-validate-url-using-javascript
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
};

function yncryptyyn(incryptme){
  var ulimit = 6;
  var key = crypto.createHash('md5').update(incryptme).digest("base64");
  key = key.slice(0,ulimit);
  var obj = {
                url: incryptme,
                key: key
            };
            return obj;
};

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
