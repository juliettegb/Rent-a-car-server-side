var express = require('express'); // pour importer le module
var app = express(); // initialisation du serveur
app.set('view engine', 'ejs');
app.use(express.static('public')); //va chercher docs dans "public", ici donc la feuille de style

var carList = [];

app.get('/', function(req, res){
  res.render('carForm', {carList});
});

app.get('/form', function(req, res){
  console.log(req.query);
  carList.push(req.query);
  res.render('carForm', {carList});

});

var port = (process.env.PORT || 8080);

app.listen(port, function(){
  console.log('Server listening on port 8080'); // pour notifier que le module est bien en fonctionnement, en écoute
});
