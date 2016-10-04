var Sequelize = require('Sequelize');
var sequelize = new Sequelize('sisgeco_local','postgres','123456',{
	//host: '192.168.23.12',
	host: 'localhost',
	dialect: 'postgres',
	pool: {
		max : 5,
		min: 0,
		idle:10000
	}
});


module.exports.Sequelize = Sequelize;
module.exports.sequelize = sequelize;