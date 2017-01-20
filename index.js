var express	= require('express'),
	path	= require('path');
	fs		= require('fs');
	cors 	= require('cors'),
	request = require('request');

var port 				= process.env.PORT || 3000,
	app 				= express(),
	clientRootPath 		= __dirname + '/app/',
	apiPath 			= 'https://xisaapi.herokuapp.com',
	clientPort 			= 8080,
	DEBUG				= false;

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
	fs.readFile(clientRootPath + 'views/index.html', (error, html) => {
		if (error) {
        	var err = new Error();
			err.status = 500;
			err.message = error.message;
			next(err);
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/how', (req,res,next) => {
	fs.readFile(clientRootPath + 'views/how.html', (error, html) => {
		if (err) {
        	var err = new Error();
			err.status = 500;
			err.message = error.message;
			next(err); 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/what', (req,res,next) => {
	fs.readFile(clientRootPath + 'views/what.html', (error, html) => {
		if (error) {
        	var err = new Error();
			err.status = 500;
			err.message = error.message;
			next(err); 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/whom', (req,res,next) => {
	fs.readFile(clientRootPath + 'views/whom.html', (error, html) => {
		if (error) {
        	var err = new Error();
			err.status = 500;
			err.message = error.message;
			next(err); 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/api/getCelebs', (req,res,next) => {
	if(DEBUG){
		fs.readFile('D:/Shenkar/XISA/source/who.json', (error, json) => {
			if (error) {
	        	var err = new Error();
  				err.status = 500;
  				err.message = error.message;
  				next(err);
	    	}
	    	res.json(JSON.parse(json)); 
		});
	}
	else {
		request(apiPath+'/getCelebs', (error, response, body) => {
			if(error){
				var err = new Error();
					err.status = 500;
					err.message = error.message;
					next(err);
			}
			else if (body.error != null){
	    		var err = new Error();
  				err.status = 500;
  				err.message = "API error"
  				next(err); 
			} 
			else if (!error && response.statusCode == 200) {
				return res.status(200).json(JSON.parse(body));
			}
		});
	}
});

app.get('/api/getCelebs/:category', (req,res,next) => {
	if(DEBUG){
		fs.readFile('D:/Shenkar/XISA/source/who.json', (error, json) => {
			if (error) {
	        	var err = new Error();
  				err.status = 500;
  				err.message = error.message;
  				next(err);
	    	}
	    	res.json(JSON.parse(json)); 
		});
	}
	else {
		request(apiPath+'/getCelebs'+req.params.category, (error, response, body) => {
			if(error){
				var err = new Error();
					err.status = 500;
					err.message = error.message;
					next(err);
			}
			else if (body.error != null){
	    		var err = new Error();
  				err.status = 500;
  				err.message = "API error"
  				next(err); 
			} 
			else if (!error && response.statusCode == 200) {
				return res.status(200).json(JSON.parse(body));
			}
		});
	}
});

app.get('/api/celeb/:name', (req,res,next) => {
	if(DEBUG){
		fs.readFile('D:/Shenkar/XISA/source/how.json', (error, json) => {
			if (error) {
	        	var err = new Error();
  				err.status = 500;
  				err.message = error.message;
  				next(err); 
	    	}
	    	res.json(JSON.parse(json)); 
		});
	}
	else {
		request(apiPath+'/celeb/'+req.params.name,  (error, response, body) => {
			if(error){
				var err = new Error();
				err.status = 500;
				err.message = error.message;
				next(err);
			}
			else if (body.error != null){
	    		var err = new Error();
  				err.status = 500;
  				err.message = "API error"
  				next(err); 
			} 
			else if (!error && response.statusCode == 200) {
				return res.status(200).json(JSON.parse(body));
			}
		});
	}
});

app.get('/api/getUsers', (req,res,next) => {
	if(DEBUG){
		fs.readFile('D:/Shenkar/XISA/source/users.json', (error, json) => {
			if (error) {
	        	var err = new Error();
  				err.status = 500;
  				err.message = error.message;
  				next(err); 
	    	}
	    	res.json(JSON.parse(json)); 
		});
	}
	else {
		request(apiPath+'/getUsers',  (error, response, body) => {
			if(error){
				var err = new Error();
					err.status = 500;
					err.message = error.message;
					next(err);
			}
			else if (body.error != null){
	    		var err = new Error();
  				err.status = 500;
  				err.message = "API error"
  				next(err); 
			}
			else if (!error && response.statusCode == 200) {
				return res.status(200).json(JSON.parse(body));
			}
		});
	}
});

app.get('/api/user/:name', (req,res,next) => {
	if(DEBUG){
		fs.readFile('D:/Shenkar/XISA/source/user.json', (error, json) => {
			if (error) {
	        	var err = new Error();
  				err.status = 500;
  				err.message = error.message;
  				next(err);
	    	}
	    	res.json(JSON.parse(json)); 
		});
	}
	else {
		var name = req.params.name;
		if(name.endsWith(':')){
			name = name.substring(0,name.length - 1);
		}
		request(apiPath+'/user/'+name,  (error, response, body) => {
			if (error) {
				var err = new Error();
  				err.status = 500;
  				err.message = error.message;
  				next(err);
			}
			else if (body.error != null){
	    		var err = new Error();
  				err.status = 500;
  				err.message = "API error"
  				next(err); 
			} 
			else if (!error && response.statusCode == 200) {
				return res.status(200).json(JSON.parse(body));
			}
		});
	}
});

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