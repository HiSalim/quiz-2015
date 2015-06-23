// -------------------------------------------------------------------------------------------------
// Archivo de más, que no está en el guión, creado para evitar la repetición de código
// nota: este archivo sería innecesario si se actualiza sequelize a una versión superior a 1.7.0
// -------------------------------------------------------------------------------------------------
/**
 * @brief Devuelve un booleano indicando si cumple o no la validacion establecida en @file quiz.js
 */
function Validacion( quiz ){
	this.err = quiz.validate(); // validamos
	this.errors = new Array(); // contenedor de errores
};

Validacion.prototype = {
	/* Comprueba si la validación ha devuelto algún tipo de error */
	comprobar: function(){ 
		if(this.err){ return true; } return false; 
	},
	/* Obtiene un array con todos los posibles errores */
	errores: function(){ 
		var cont = 0;
		for (var prop in this.err) this.errors[cont++]={message: this.err[prop]}; 
		return this.errors;
	}
}

module.exports = Validacion;