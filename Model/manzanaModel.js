var conexionbd  = require('../BD/conexionBD.js');
var manzanabd = conexionbd.sequelize.define('piura_sig_manzanas',{
							gid:{ 
									type : conexionbd.Sequelize.INTEGER,
									primaryKey : true,
									autoIncrement: true
								},
							nombre_mun: conexionbd.Sequelize.STRING,
							nuevo_nro_manzana: conexionbd.Sequelize.INTEGER,
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
}).catch(function(err){
	console.log('error conexion',err);
});

function manzanaAdd(nombre_mun, nuevo_nro_manzana,geom){	
	 return conexionbd.sequelize.query('SELECT gis.gis_manzana_add(?,?,?)',
		  { replacements: [nombre_mun,nuevo_nro_manzana,geom], type: conexionbd.sequelize.QueryTypes.SELECT }
		).then(function(data) {
		  return data;
		});
}

function manzanaSelection(geom){
	return conexionbd.sequelize.query('SELECT gis.gis_manzana_selection(?) as selection',
		  { replacements: [geom], type: conexionbd.sequelize.QueryTypes.SELECT, model: manzanabd }
		).then(function(data) {
		  return (JSON.parse(JSON.stringify(data))[0].selection);
		});	
}

//module.exports.usuarioModel = usuarioModel;
module.exports.manzanaAdd = manzanaAdd;
module.exports.manzanaSelection = manzanaSelection;