var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
	mongoose.connect('mongodb://thegorazio:408528867@ds011412.mlab.com:11412/diplom');
var db = mongoose.connection;

var Schema = mongoose.Schema;
var LabSchema = new Schema({
	user: {
		type: String, required: true
	},
	stand: {
		type: Array, required: true
	}
});
var LabModel = mongoose.model('labs', LabSchema);

db.on('error', (err) => {
	console.log(`Connection error ${err}`);
});
/*
var Client = require("ibmiotf");
var config = {
    "org" : "274qto",
    "id" : "glebTest",
    "domain": "internetofthings.ibmcloud.com",
    "type" : "newType1",
    "auth-method" : "token",
    "auth-token" : "1234567890"
};
 
var deviceClient = new Client.IotfDevice(config);
deviceClient.connect();
deviceClient.on('connect', () => {});
deviceClient.on('error', (err) => {console.error(err)});

var appClientConfig = {
    "org" : "274qto",
    "id" : "a-274qto-rkipgj1zse",
    "domain": "internetofthings.ibmcloud.com",
    "auth-key" : "a-274qto-rkipgj1zse",
    "auth-token" : "AVQG9j9KLtUHG0qZCE"
}
var appClient = new Client.IotfApplication(appClientConfig);
var temp = [];

appClient.connect();
appClient.on("connect", () => {appClient.subscribeToDeviceEvents();});
appClient.on("error", (err) => {console.error(err);});
appClient.on("deviceEvent", (e) => {console.log(e); temp.push(e)});*/

/* GET home page. */
router.get('/', (req, res, next) => {
	res.send('Hello, to virlab backend, duude');
	res.end();
	/*var data = LabModel.find((err, labs) => {
		if (!err) {
			res.send(labs);
			res.end();
		} else {
			res.statusCode = 500;
			res.send('Error in db');
			res.end();
		}
	});*/
});

router.post('/save', (req, res, next) => {
	//console.log(req.body);
	//deviceClient.publish("status","json",'{"d" : { "cpu" : 60, "mem" : 50 }}');
	var Lab = new LabModel({
		user: req.body.user,
		stand: req.body.stand
	});
	console.log(Lab);
	Lab.save()
		.then(() => {
			res.statusCode = 200;
			res.send("Success");
			res.end();
		})
		.catch((err) => {
			res.statusCode = 500;
			res.send("Database error");
			res.end();
		});
});

router.post('/load', (req, res, next) => {
	if (req.body && req.body.user !== '') {
		var lab = LabModel.findOne({user: req.body.user}, (err, lab) => {
			if (!err) {
				console.log(lab);
				if (!lab) {
					res.send(`Lab data with username - ${req.body.username} is not found`);
					res.end();
				} else {
					res.send(lab);
					res.end();
				}
			} else {
				res.statusCode = '500';
				res.send('Database error');
				res.end();
			}
		});
	}

});

module.exports = router;
