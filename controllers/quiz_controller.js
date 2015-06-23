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
		res.render('quizes/index', {quizes: quizes, busqueda: busqueda, errors: []});
	}).catch(function(error){ next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', { quiz: req.quiz, errors: []});
	})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		var resultado = 'Incorrecto';
		if(req.query.respuesta === req.quiz.respuesta ){
			resultado = 'Correcto';
		}
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
	})
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build( // crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );
	// Comprobamos si contiene algun tipo de error y devolvemos un array con todos los errores posibles
	// nota: método then() de validate() no existe en la version 1.7.0 de sequelize
	var Validacion = require('./hack');
	var validacion = new Validacion(quiz);

	if( validacion.comprobar() )
	{
		res.render('quizes/new', {quiz: quiz, errors: validacion.errores()});
	}else{
		// guarda en BD los campos pregunta y respuesta de quiz
		quiz.save({fields: ["pregunta", "respuesta"]}).then( function(){
			res.redirect('/quizes');
		}) // Redireccion HTTP (URL relativo) lista de preguntas
	}

};

// GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	// Comprobamos si contiene algun tipo de error y devolvemos un array con todos los errores posibles
	// nota: método then() de validate() no existe en la version 1.7.0 de sequelize
	var Validacion = require('./hack');
	var validacion = new Validacion(req.quiz);

	if( validacion.comprobar() ){
		res.render('quizes/edit', {quiz: req.quiz, errors: validacion.errores()});
	}else{
		req.quiz 	// save: guarda campos pregunta y respuesta en DB
		.save( {fields: ["pregunta",  "respuesta"]})
		.then( function(){ res.redirect('/quizes');});
	}	// Redirección HTTP a la lista de preguntas (URL relativo)

};

// DELETE /quizes/:id
exports.destroy = function(req, res){
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch( function(error){ next(error)});
};

// GET /author
exports.author = function(req, res){
	var myphoto = 'images/photo.png';
	res.render('author', {photo: myphoto, errors: []});
};
