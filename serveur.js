var express = require('express'); // pour importer le module
var app = express(); // initialisation du serveur
var bodyParser = require('body-parser');
var request = require('request');
var mongoose = require('mongoose');
app.set('view engine', 'ejs');
app.use(express.static('public')); //va chercher docs dans "public", ici donc la feuille de style
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//CameraExample
const fileUpload = require('express-fileupload');
app.use(fileUpload());

var carList = [];

//Enregistrement BDD
var options = { server: { socketOptions: {connectTimeoutMS: 30000 } }};
mongoose.connect('mongodb://juliettegb:Drivy@ds133496.mlab.com:33496/drivy', options, function(err){
  console.log(err);
})

var carSchema = mongoose.Schema({
  modele: String,
  marque: String,
  ville: String,
  places: Number,
  lat: Number,
  lon: Number,
});

var carModel = mongoose.model('Car', carSchema);



app.get('/', function(req, res){
  res.render('carForm', {carList});
});

app.post('/form', function(req, res){
  console.log(req.body);

  request("https://maps.googleapis.com/maps/api/geocode/json?address="+req.body.ville+"&key=AIzaSyDLiaDOwBIN3ZMlrVJ3KVSbqqsXbC6SXb4", function(error, response, data){
    var data = JSON.parse(data);
    console.log(data);
    var lat = data.results[0].geometry.location.lat;
    var lon = data.results[0].geometry.location.lng;
    console.log(lat);
    console.log(lon);
    //var newCar = {modele: body.modele, marque: body.marque, ville: body.ville, places: body.places, lat: lat, lon: lon};
    //carList.push(newCar);

    var car = new carModel({ //ordre d'enregistrement
      modele: req.body.modele,
      marque: req.body.marque,
      ville: req.body.ville,
      places: req.body.places,
      lat: lat,
      lon: lon
    });

    car.save(function (error, car){ //on est sur de l'asynchrone donc fonction de callback qui sera exécutée lorsque le backend aura fini son boulot!
      console.log(error);
      console.log(car);
      console.log('************');

      // cf .then dans App.js
      res.send(car.id);
    });

  });

  res.render('carForm', {carList});

});

//Ajout d'une route pour enregistrer la photo prise avec la camera
app.post('/saveImageCar', function(req,res){

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  //.files = mécanique automatique grâce au fileupload
  let imageCar = req.files.imageCar;
  console.log(imageCar);

  // Use the mv() method to place the file somewhere on your server
  //.name = this.props.id+'.jpg' (cf cameraExample.js)
  imageCar.mv('./public/'+imageCar.name, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
})

var port = (process.env.PORT || 8080);

app.listen(port, function(){
  console.log('Server listening on port 8080'); // pour notifier que le module est bien en fonctionnement, en écoute
});
