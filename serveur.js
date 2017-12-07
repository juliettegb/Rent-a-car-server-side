var express = require('express'); // pour importer le module
var app = express(); // initialisation du serveur
var bodyParser = require('body-parser');
var request = require('request');
app.set('view engine', 'ejs');
app.use(express.static('public')); //va chercher docs dans "public", ici donc la feuille de style
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var multer = require('multer');
var upload = multer ({
  dest: './uploads/'
});

var carList = [];

app.get('/', function(req, res){
  res.render('carForm', {carList});
});

app.post('/form', upload.array(), function(req, res){
  console.log(req.body);

  request("https://maps.googleapis.com/maps/api/geocode/json?address="+req.body.ville+"&key=AIzaSyALD-Dfvhh3rW5r6twUYDyz_T75QMHsDcU", function(error, response, body){
    var body = JSON.parse(body);
    console.log(body);
  });

  res.render('carForm', {carList});

});

var port = (process.env.PORT || 8080);

app.listen(port, function(){
  console.log('Server listening on port 8080'); // pour notifier que le module est bien en fonctionnement, en écoute
});
