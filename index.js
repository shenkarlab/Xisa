var express	= require('express'),
	path	= require('path');
	fs		= require('fs');

var port = process.env.PORT || 3000,
	app = express(),
	clientRootPath = __dirname + '/app/';

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

app.get('*', (req,res) => {
	res.end('404');
});

//create server
app.listen(port, () => {
  console.log('listening on port '+port+'!');
})