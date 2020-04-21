const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 9900;
var Auth2 = require('./middleware/Auth2');
var session = require('express-session');

app.use(bodyParser.urlencoded())
app.set('view engine', 'ejs');
app.use('/',express.static(__dirname + '/views/'));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 3600000 } }))

app.get('/', Auth2,  function (req, res) {
	
    res.render("home.ejs")

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