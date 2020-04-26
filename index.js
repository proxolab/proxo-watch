const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 9900;
var Auth2 = require('./middleware/Auth2');
var session = require('express-session');
const path = require('path');
const fs = require('fs');
const hbjs = require('handbrake-js');
const axios = require('axios');
const genThumbnail = require('simple-thumbnail')

app.use(bodyParser.urlencoded())
app.set('view engine', 'ejs');
app.use('/',express.static(__dirname + '/views/'));
app.use('/Videos',  express.static(__dirname + '/Videos/'));
app.use('/thumbnails',  express.static(__dirname + '/thumbnails/'));
const directoryPath = path.join(__dirname, '/Videos/');
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 3600000 } }))



app.get('/thumbnail/:name',  function (req, res) {
	
genThumbnail(__dirname +'/Videos/'+ req.params.name+'.mp4' , __dirname + '/thumbnails/'+ req.params.name+'.jpg', '800x?').then(() => res.send("done"))
    .catch(err => console.error(err))
});

app.get('/convert/:name',  function (req, res) {
	  	var dosya = req.params.name ; 
		
	if(fs.existsSync(__dirname +'/Videos/'+ dosya+'.mp4')) {
        console.log("The file exists.");
		res.send("dosya zaten çevrilmiş veya şu an çevriliyor. lütfen biraz sabredelim")
    } else {
   
	
	hbjs.spawn({ input: __dirname + '/Videos/'+dosya+'.mkv' , output: __dirname +'/Videos/'+ dosya+'.mp4'})
  .on('error', err => {
    // invalid user input, no video found etc
	console.log(err);
  })
  .on('begin', () => {
        console.log("cevirme işlemi basladi");
		res.send("cevirme işlemi başladi") 
    })
  .on('progress', progress => {
      console.log(
      'Percent complete: %s, ETA: %s',
      progress.percentComplete,
      progress.eta
    )
  })
   .on('complete', () => {
        console.log("file coverted");
		fs.unlink(__dirname + '/Videos/'+dosya+'.mkv', function (){
		
		console.log("file is deleted")
		
		})
    });
    }
	


});

app.get('/generatethumbs',  function (req, res) {
	
	
// var videos = [];
	fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
      // videos.push(file); 
	   
    genThumbnail(__dirname +'/Videos/'+ file.split(".")[0] +'.mp4' , __dirname + '/thumbnails/'+ file.split(".")[0]+'.jpg', '800x?', {"seek": "00:00:29"} ).then(() => res.send("done"))
    .catch(err => console.error(err))
	
	});
	

	});
res.send("thumbs generated");
});

app.get('/watch/:name', Auth2,  function (req, res) {
	
	
    res.render("single.ejs", {"video": req.params.name })

});

app.get('/', Auth2,  function (req, res) {
	
	var videos = [];
	fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
       videos.push(file); 
    });
	
	console.log(videos);
	
    res.render("home.ejs", {"videos": videos , "first" : videos[0]	})
	
	});
	

});

app.post('/login',  function (req, res) {
	
	if(req.body.username == "proxo" && req.body.password == "netfiliz" )
	{
		req.session.user = "proxo";
	}
		res.redirect("/")

});

app.listen(PORT, function () {
  console.log('Server is running on Port:', PORT);
});
// git remote add origin https://github.com/proxolab/proxo-watch.git