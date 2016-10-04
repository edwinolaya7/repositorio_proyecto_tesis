
var conexionbd  = require('../BD/conexionBD.js');
var usuariobd = conexionbd.sequelize.define('tmp_tb_usuario',{
							id:{ 
									type : conexionbd.Sequelize.INTEGER,
									primaryKey : true,
									autoIncrement: true
								},
							dni: conexionbd.Sequelize.STRING,
							nombre: conexionbd.Sequelize.STRING
						},
						{
							//false para q la tabla no contenga las columnas createAt,updateAt
							timestamps : false,
							//deshabilita por defecto la convecion del nombre de la tabla
							freezeTableName : true
						});


conexionbd.sequelize.authenticate().then(function(){
	console.log('conexion bd exitosa');
});

function usuarioFindAll(){	
	  return usuariobd.findAll({attributes: ['dni','nombre']}).then(function(data){
	  	return data;
	  });
}

function usuarioFindById(id){
	return usuariobd.findById(id,{ attributes: ['dni','nombre']}).then(function(data){
		return data;
	});
}


//module.exports.usuarioModel = usuarioModel;
module.exports.usuarioFindById = usuarioFindById;
module.exports.usuarioFindAll = usuarioFindAll;