var express = require('express');
var nunjucks = require("nunjucks");
var bodyParser = require("body-parser");


var app = express();
app.use(express.static('View'));
app.use(express.static('Controller'));
app.use(express.static('Model'));
app.use(express.static('Public'));

var bodyParser = require("body-parser");

var usuario_model = require("./Model/usuarioModel.js");
var cliente_model = require("./Model/clienteModel.js");
var manzana_model = require("./Model/manzanaModel.js");

var error = '';

nunjucks.configure(__dirname + "/View", {
	express : app
});

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
	res.write(nunjucks.render('login.html', { msjError : error}));
	res.end();
});

app.get('/mapa', function(req, res){
	res.write(nunjucks.render('mapa.html', { msjError : error}));
	res.end();
});

app.get('/Usuario', function(req, res){
	usuario_model.usuarioFindAll().then(function(data){
			res.write(nunjucks.render('Usuario/usuarioGetAll.html',{
				usuarios : data
			}));
			res.end();
	});
});

app.get('/UsuarioById', function(req, res){

	usuario_model.usuarioFindById(1).then(function(data){
		res.write(nunjucks.render('Usuario/usuarioById.html',{
			usuario : data
		}));
		res.end();
	});
});

app.post('/authenticated', function(req,res){

	error='';
	var usuario = req.body.usuario_login;
	var password = req.body.password_login;

	if(usuario=="edwin" && password=="44674373"){
		//res.write(nunjucks.render("mapa_menu.html"));
		res.write(nunjucks.render("nuevo_menu.html"));
		res.end();
	}
	else{
		error = 'Error el Login';
		res.redirect('/');
	}
});

app.post('/clienteFindBySuministro', function(req,res){
	var suministro = req.body.find_suministro;
	cliente_model.clienteFindBySuministro(suministro).then(function(data){
		res.send(data);
	});
});

/* TABLA MANZANA*/

app.post('/manzana/add_form', function(req,res){	
	var geometria = req.body.geometria;
	res.send(nunjucks.render('Manzana/manzanaAdd.html',{
		geometria: geometria
	}));
});

app.post('/manzana/add',function(req,res){
	var nro_municipal = req.body.nro_municipal;
	var mz_ubigeo = req.body.mz_ubigeo;
	var geom = req.body.geometria;
	manzana_model.manzanaAdd(nro_municipal,mz_ubigeo,geom).then(function(data){
		res.send(data);
	});
});

app.post('/manzana/Selection',function(req,res){
	var geom = req.body.geometria;
	manzana_model.manzanaSelection(geom).then(function(data){
		res.send(data);
	});
});

app.post('/manzana/eliminar',function(req,res){
	var geom = req.body.geometria;
	manzana_model.manzanaEliminar(geom).then(function(data){
		res.send(data);
	});
});


app.listen(3000, function(){
	console.log("servidor ejecutandose!!!");
});
