var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res){
	res.render('comments/new.ejs', { quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res){
	var comment = models.Comment.build(
					{ texto: req.body.comment.texto,
						QuizId: req.params.quizId
					});
	// 
	var Validacion = require('./hack');
	var validacion = new Validacion(comment);

	if( validacion.comprobar() )
	{
		res.render('comments/new', {comment: comment, quizid: req.params.quizId, errors: validacion.errores()});
	}else{ // save: guarda en DB campo texto de comment
		comment.save().then( function(){ res.redirect('/quizes/'+req.params.quizId)}); // res.redirect: Redirección HTTP a lista de preguntas
	}

};