var clientRootPath 		= __dirname + '/build/';

var route = (req, res, next, page) => {
	fs.readFile(clientRootPath + page, (error, html) => {
		if (error) {
        	var err = new Error();
			err.status = 500;
			err.message = error.message;
			next(err);
    	}
    	res.write(html);
    	res.end();  
	});
};

exports.inedxPage = (req, res, next) => {
	route(req, res, next, 'index.html');
};

exports.howPage = (req, res, next) => {
	route(req, res, next, 'how.html');
};

exports.whatPage = (req, res, next) => {
	route(req, res, next, 'what.html');
};

exports.whomPage = (req, res, next) => {
	route(req, res, next, 'whom.html');
};
