var conexion  = require('../BD/Conexion.js');

var Tmp_tb_usuario = conexion.sequelize.define('tmp_tb_usuario',{
	dni: conexion.Sequelize.STRING,
	nombre: conexion.Sequelize.STRING
});

function usergetAll(){
	Tmp_tb_usuario.findAll().then(function(users) {
	  console.log(users);
	});
}

module.exports.usergetAll = usergetAll();