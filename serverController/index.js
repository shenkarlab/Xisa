'use strict';
var express		= require('express'),
	fs			= require('fs'),
	request 	= require('request');

var clientRootPath 		= __dirname + '/../build/',
	apiPath 			= 'https://xisaapi.herokuapp.com',		
	DEBUG				= false;

var error = (next, msg, status) => {
	var err = new Error();
	err.status = status;
	err.message = msg;
	next(err);
};

var route = (req, res, next, page) => {
	fs.readFile(clientRootPath + page, (err, html) => {
		if (err) {
			error(next, err.message, 500);
    	}
    	res.write(html);
    	res.end();  
	});
};

var localApi = (req, res, next, path) => {
	fs.readFile(clientRootPath + path, (err, json) => {
		if (err) {
        	error(next, err.message, 500);
    	}
    	res.json(JSON.parse(json)); 
	});
};

var api = (req, res, next, path) => {
	request(path, (err, response, body) => {
		if(err){
			error(next, err.message, 500);
		}
		else if (body.error != null){
			error(next, "API error", 500);
		} 
		else if (!err && response.statusCode == 200) {
			return res.status(200).json(JSON.parse(body));
		}
	});
};

var saveFile = (req, res, next, fileName) => {
	fs.writeFile(fileName, JSON.stringify(req.body), function(err) {
		if(err) {
			console.log(err);
			res.sendStatus(500);
		}
		res.sendStatus(200);
	});
};

var getFile = (req, res, next, fileName) => {
	fs.readFile(fileName, 'utf8', (err, json) => {
		if (err) {
			error(next, err.message, 500);
		}
		res.json(JSON.parse(json));
	});
};

exports.inedxPage = (req, res, next) => {
	route(req, res, next, 'index.html');
};

exports.howPage = (req, res, next) => {
	route(req, res, next, 'hated.html');
};

exports.whatPage = (req, res, next) => {
	route(req, res, next, 'hater.html');
};

exports.whomPage = (req, res, next) => {
	route(req, res, next, 'haters.html');
};

exports.getCelebs = (req,res,next) => {
	if(DEBUG){
		localApi(req, res, next, '/data/celebs.json');
	}
	else{
		api(req, res, next, apiPath + '/getCelebs');
	}
};

exports.getCategoryCelebs = (req,res,next) => {
	if(DEBUG){
		localApi(req, res, next, '/data/celebs.json');
	}
	else{
		api(req, res, next, apiPath + '/getCelebs/' + req.params.category);
	}
};

exports.getCeleb = (req,res,next) => {
	if(DEBUG){
		localApi(req, res, next, '/data/celeb.json');
	}
	else{
		api(req, res, next, apiPath + '/celeb/' + req.params.name + '/' + req.params.twitter_name);
	}
};

exports.getCategoryCeleb = (req,res,next) => {
	if(DEBUG){
		localApi(req, res, next, '/data/celeb.json');
	}
	else{
		api(req, res, next, apiPath + '/celeb/' + req.params.name + '/' + req.params.twitter_name + '/' + req.params.category);
	}
};

exports.getUser = (req,res,next) => {
	if(DEBUG){
		localApi(req, res, next, '/data/user.json');
	}
	else{
		api(req, res, next, apiPath + '/user/' + req.params.name);
	}	
};

exports.getUsers = (req,res,next) => {
	if(DEBUG){
		localApi(req, res, next, '/data/users.json');
	}
	else{
		api(req, res, next, apiPath + '/getUsers');
	}
};

exports.getHated = (req,res,next) => {
	getFile(req, res, next, clientRootPath + '/data/topHated.txt');
};

exports.saveHated = (req,res,next) => {
	saveFile(req, res, next, clientRootPath + '/data/topHated.txt');
};



