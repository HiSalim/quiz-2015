// Definición del modelo de Quiz

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Quiz',
				{ 
				  pregunta: {
					type: DataTypes.STRING,
					validate: { notEmpty: {msg: "Falta Pregunta"}, 
								notIn: { args: [['pregunta', 'Pregunta']], msg: 'Debe introducir una pregunta' } // Las de por defecto no deberian contar
							  }
					},
				  respuesta: {
				  	type: DataTypes.STRING,
				  	validate: { notEmpty: {msg: "Falta Respuesta"}, 
				  				notIn: { args: [['respuesta', 'Respuesta']], msg: 'Debe introducir una respuesta' } // Se debe introducir algo
				  			  }
				  	}
				});
}
