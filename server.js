var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var Twitter = require('twitter-js-client').Twitter;

app.use(express.static(__dirname + '/app')); 

var config = {
	"consumerKey": "",
	"consumerSecret": "",
	"accessToken": "",
	"accessTokenSecret": ""
};

var twitter = new Twitter(config);

app.get('/api/twts', function(req, res) {
	var callback = function(e){ res.send(e); };
	twitter.getHomeTimeline({ count: '10'}, callback, callback);
});

app.get('/api/twt/:id', function(req, res) {
	var id = req.params.id;
	var callback = function(e){ res.send(e); };
	twitter.getTweet({ id: id}, callback, callback);
});

app.get('/list', function(req, res) {
	res.sendfile('./app/list.html'); 
});

	app.get('/view/:id', function(req, res) {
	res.sendfile('./app/view.html'); 
});


Twitter.prototype.doPost = function (url, error, success) {
    this.oauth.post(url, this.accessToken, this.accessTokenSecret, {}, "json", function (err, body, response) {
        console.log('URL [%s]', url);
        if (!err && response.statusCode == 200) {
            success(body);
        } else {
            error(err, response, body);
        }
    });
};

Twitter.prototype.reTweet = function (id, error, success) {
    var path = '/statuses/retweet/' + id + '.json';
    var url = this.baseUrl + path;
    this.doPost(url, error, success);
};

app.get('/api/retwt/:id', function(req, res) {
	var id = req.params.id;
	var callback = function(e){ res.send(e); };
	twitter.reTweet(id, callback, callback);
});

app.listen(9090);