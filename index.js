var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var User = require('./models/user');
var app = express();

var secret = 'bestkeptsecretever999';

mongoose.connect('mongodb://localhost:27017/myauthenticatedusers');

app.use(bodyParser.urlencoded({extended:true}));
app.use('/api/users', require('./controllers/users'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/auth', function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if(err || !user) return res.send({message: 'User Not Found'});
    user.authenticated(req.body.password, function(err, result) {
      if(err || !user) return res.send({message: 'User Not Authenticated'});
      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
      });
    }); 
});

app.listen(3000);
