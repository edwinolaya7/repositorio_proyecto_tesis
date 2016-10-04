var conexionbd  = require('../BD/conexionBD.js');
var clientebd = conexionbd.sequelize.define('piura_sig_clientes',{
							gid:{
									type : conexionbd.Sequelize.INTEGER,
									primaryKey : true,
									autoIncrement: true
								},
							suministro: conexionbd.Sequelize.INTEGER,
							geom: conexionbd.Sequelize.GEOMETRY
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

function clienteFindBySuministro(suministro){
	return clientebd.findOne({
						where : {suministro:suministro},
						attributes : ['geom']
						}).then(function(data){
		return data;
	});
} 

module.exports.clienteFindBySuministro = clienteFindBySuministro;