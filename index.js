var express	= require('express'),
	path	= require('path');
	fs		= require('fs');
	http	= require('http'),
	cors = require('cors');

var port = process.env.PORT || 3000,
	app = express(),
	clientRootPath = __dirname + '/app/',
	apiPath = 'xisaserver.herokuapp.com';

//server config
app.use(express.static(__dirname + '/app/static'));
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

app.get('/', (req,res,next) => {
	fs.readFile(clientRootPath + 'views/index.html', (err, html) => {
		if (err) {
        	throw err; 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/how', (req,res,next) => {
	fs.readFile(clientRootPath + 'views/how.html', (err, html) => {
		if (err) {
        	throw err; 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/what', (req,res,next) => {
	fs.readFile(clientRootPath + 'views/what.html', (err, html) => {
		if (err) {
        	throw err; 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/whom', (req,res,next) => {
	fs.readFile(clientRootPath + 'views/whom.html', (err, html) => {
		if (err) {
        	throw err; 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/api/getCelebs', (req,res,next) => {
	var options = {
		host: apiPath,
		path: '/getCelebs'
	}
	console.log(options);
	var request = http.request(options, (response) => {
		console.log(`STATUS: ${res.statusCode}`);
		var json = "";
		response.on('data', (data) => {
    		json += data;
    		console.log(data);	
    	});
    	response.on('end', () => {
    		console.log('done');
    		res.status(200).json(json);
    	});
	});
	request.on('error', (err) => {
		if (err) {
    		throw err; 
    	}
	});
});

app.get('/api/celeb/:name', (req,res,next) => {
	var options = {
		host: apiPath,
		path: '/celeb/' + req.query.name
	}
	console.log(options);
	var request = http.request(options, (response) => {
		console.log(`STATUS: ${res.statusCode}`);
		var json = "";
		response.on('data', (data) => {
    		json += data;
    		console.log(data);	
    	});
    	response.on('end', () => {
    		console.log('done');
    		res.status(200).json(json);
    	});
	});
	request.on('error', (err) => {
		if (err) {
    		throw err; 
    	}
	});
});

app.get('*', (req,res) => {
	res.end('404');
});

//create server
app.listen(port, () => {
  console.log('listening on port '+port+'!');
})