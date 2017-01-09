var express	= require('express'),
	path	= require('path');
	fs		= require('fs');
	http	= require('http');

var port = process.env.PORT || 3000,
	app = express(),
	clientRootPath = __dirname + '/app/',
	apiPath = 'xisaserver.herokuapp.com';

//server config
app.use(express.static(__dirname + '/app/static'));
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//routes
app.all('*', (req,res,next) => {
	res.writeHead(200, { "Content-Type": "text/html" });
	next()
});

app.all('/api/*', (req,res,next) => {
	res.writeHead(200, { "Content-Type": "application/json" });
	next()
});

app.get('/', (req,res) => {
	fs.readFile(clientRootPath + 'views/index.html', (err, html) => {
		if (err) {
        	throw err; 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/how', (req,res) => {
	fs.readFile(clientRootPath + 'views/how.html', (err, html) => {
		if (err) {
        	throw err; 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/what', (req,res) => {
	fs.readFile(clientRootPath + 'views/what.html', (err, html) => {
		if (err) {
        	throw err; 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/whom', (req,res) => {
	fs.readFile(clientRootPath + 'views/whom.html', (err, html) => {
		if (err) {
        	throw err; 
    	}
    	res.write(html);
    	res.end();  
	});
});

app.get('/api/getCelebs', (req,res) => {
	var options = {
		protocol: 'http',
		method: 'GET',
		host: apiPath,
		hostname: apiPath,
		path: '/getCelebs'
	}
	http.request(options, (response) => {
		vsr json = "";
		response.on('error', (err) => {
			if (err) {
	    		throw err; 
	    	}
		});
		response.on('data', (data) => {
    		json += data;	
    	});
    	response.on('end', () => {
    		res.status(200).json(json);
    	});
	});
});

app.get('/api/celeb/:name', (req,res) => {
	var options = {
		protocol: 'http',
		method: 'GET',
		host: apiPath,
		hostname: apiPath,
		path: '/celeb/' + req.query.name
	}
	http.request(options, (response) => {
		vsr json = "";
		response.on('error', (err) => {
			if (err) {
	    		throw err; 
	    	}
		});
		response.on('data', (data) => {
    		json += data;	
    	});
    	response.on('end', () => {
    		res.status(200).json(json);
    	});
	});
});

app.get('*', (req,res) => {
	res.end('404');
});

//create server
app.listen(port, () => {
  console.log('listening on port '+port+'!');
})