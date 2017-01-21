var express		= require('express'),
	path		= require('path');
	fs			= require('fs');
	request 	= require('request');

var clientRootPath 		= __dirname + '/build/',
	apiPath 			= 'https://xisaapi.herokuapp.com',
	DEBUG				= true;

var route = (req, res, next, page) => {
	fs.readFile(clientRootPath + page, (error, html) => {
		if (error) {
			error(next, error.message, 500);
    	}
    	res.write(html);
    	res.end();  
	});
};

var api = (req, res, next, path) => {
	request(apiPath + path, (error, response, body) => {
			if(error){
				error(next, error.message, 500);
			}
			else if (body.error != null){
				error(next, "API error", 500);
			} 
			else if (!error && response.statusCode == 200) {
				return res.status(200).json(JSON.parse(body));
			}
		});
};

var error = (next, msg, status) => {
	var err = new Error();
	err.status = status;
	err.message = msg;
	next(err);
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
