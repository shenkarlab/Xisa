var express	= require('express'),
	path	= require('path');
	fs		= require('fs');
	cors 	= require('cors'),
	request = require('request');

var port 			= process.env.PORT || 3000,
	app 			= express(),
	clientRootPath 	= __dirname + '/app/',
	apiPath 		= 'xisaserver.herokuapp.com',
	clientPort 		= 8080,
	DEBUG			= true;	

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
	if(DEBUG){
		fs.readFile('D:/Shenkar/XISA/source/who.json', (err, json) => {
			if (err) {
	        	throw err; 
	    	}
	    	res.json(JSON.parse(json)); 
		});
	}
	else {
		request('http://localhost:8080/getCelebs', (error, response, body) => {
			if(error){
				console.log(error);
			}
			if (!error && response.statusCode == 200) {
			console.log(body);
			return res.status(200).json(JSON.parse(body));
			}
		});
	}
});

app.get('/api/celeb/:name', (req,res,next) => {
	if(DEBUG){
		fs.readFile('D:/Shenkar/XISA/source/how.json', (err, json) => {
			if (err) {
	        	throw err; 
	    	}
	    	res.json(JSON.parse(json)); 
		});
	}
	else {
		var queryRequest = 'http://localhost:8080/celeb/'+req.params.name;
		request(queryRequest,  (error, response, body) => {
			if(error){
			console.log(error);
			}
			if (!error && response.statusCode == 200) {
			return res.status(200).json(JSON.parse(body));
			}
		});
	}
});

app.get('/api/getUsers', (req,res,next) => {
	if(DEBUG){
		fs.readFile('D:/Shenkar/XISA/source/users.json', (err, json) => {
			if (err) {
	        	throw err; 
	    	}
	    	res.json(JSON.parse(json)); 
		});
	}
	else {
		var queryRequest = null; //TODO: 'http://localhost:8080/celeb/'+req.params.name;
		request(queryRequest,  (error, response, body) => {
			if(error){
				console.log(error);
			}
			if (!error && response.statusCode == 200) {
			return res.status(200).json(JSON.parse(body));
			}
		});
	}
});

app.get('/api/user/:name', (req,res,next) => {
	if(DEBUG){
		fs.readFile('D:/Shenkar/XISA/source/user.json', (err, json) => {
			if (err) {
	        	throw err; 
	    	}
	    	res.json(JSON.parse(json)); 
		});
	}
	else {
		var queryRequest = null; //TODO: 'http://localhost:8080/celeb/'+req.params.name;
		request(queryRequest,  (error, response, body) => {
			if(error){
				console.log(error);
			}
			if (!error && response.statusCode == 200) {
			return res.status(200).json(JSON.parse(body));
			}
		});
	}
});

app.get('*', (req,res) => {
	res.status(404).end('404');
});

//create server
app.listen(port, () => {
  console.log('listening on port '+port+'!');
});