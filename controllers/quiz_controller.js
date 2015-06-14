var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if( quiz ){
				req.quiz = quiz;
				next();
			}else{
				next(new Error('No existe quizId = '+quizId));
			}
		}).catch( function(error){ next(error); });
};
// GET /quizes
exports.index = function(req, res) {
	var query_where = '%'; // Caso para mostrar por defecto el listado por completo
	var busqueda = false; // Indicador de que no se realiza ninguna busqueda 
	// Insertar comodin para la busqueda de un patrón
	if( req.query.search )
	{
		query_where = '%'+req.query.search+'%';
		// Se sustituye los espacios por un '%'
		query_where = query_where.replace(/[\n\t\s]+/gm, '%');
		busqueda = true; // Se ha realizado una busqueda
	}
	// Consultamos la BD
	models.Quiz.findAll({where: ["pregunta like ?", query_where], order: 'pregunta ASC'}).then( function(quizes){
		res.render('quizes/index', {quizes: quizes, busqueda: busqueda});
	}).catch(function(error){ next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', { quiz: req.quiz});
	})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		var resultado = 'Incorrecto';
		if(req.query.respuesta === req.quiz.respuesta ){
			resultado = 'Correcto';
		}
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
	})
};

// GET /author
exports.author = function(req, res){
	var myphoto = 'images/photo.png';
	res.render('author', {photo: myphoto});
};