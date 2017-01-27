'use strict';
var express		= require('express'),
	ctrl 		= require('./serverController'),
	cors 		= require('cors'),
	bodyParser 	= require('body-parser');

var port 		= process.env.PORT || 3000,
	app 		= express();

//server config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/build/'));
app.use(cors());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Content-Type", "text/html");
  	next();
});

//routes
app.all('/api/*', (req,res,next) => {
	res.setHeader("Content-Type", "application/json");
	next()
});

app.all('/local/*', (req,res,next) => {
	res.setHeader("Content-Type", "application/json");
	next()
});


app.get('/', ctrl.inedxPage);

app.get('/how', ctrl.howPage);

app.get('/what', ctrl.whatPage);

app.get('/whom', ctrl.whomPage);

app.get('/api/getCelebs', ctrl.getCelebs);

app.get('/api/getCelebs/:category', ctrl.getCategoryCelebs);

app.get('/api/celeb/:name', ctrl.getCeleb);

app.get('/api/celeb/:name/:category', ctrl.getCategoryCeleb);

app.get('/api/getUsers', ctrl.getUsers);

app.get('/api/user/:name', ctrl.getUser);

app.get('/local/hated', ctrl.getHated);

app.post('/local/hated', ctrl.saveHated);

app.get('*', (req,res,next) => {
	var err = new Error();
  	err.status = 404;
  	next(err);
});

app.use((err,req,res,next) => {
	if(err.status == 404){
		return res.status(404).end(err.message);
	}
	else if(err.status == 500){
		return res.status(500).end(err.message);
	}
});

//create server
app.listen(port, () => {
  console.log('listening on port '+port+'!');
});