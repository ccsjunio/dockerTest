module.exports = function(application){
	/*application.get('/home', function(req, res){
		application.app.controllers.home.index(application, req, res);
	});*/

	application.get('/home', function(req, res){
		application.app.controllers.home.dashboard(application, req, res);
	});

	application.get('/dashboard', function(req, res){
		application.app.controllers.home.dashboard(application, req, res);
	});

	application.get('/time', function(req, res){
		application.app.controllers.home.timeIndex(application, req, res);
	});

	application.get('/knowledge', function(req, res){
		application.app.controllers.home.knowledgeIndex(application, req, res);
	});

	application.get('/health', function(req, res){
		application.app.controllers.home.healthIndex(application, req, res);
	});

	application.get('/emotion', function(req, res){
		application.app.controllers.home.emotionIndex(application, req, res);
	});

	application.get('/summary', function(req, res){
		application.app.controllers.home.summaryIndex(application, req, res);
	});

	application.get('/get_incomplete_user_questionaire', function(req, res){
		application.app.controllers.home.getIncompleteUserQuestionaire(application, req, res);
	});

	application.get('/get_complete_user_questionaires', function(req, res){
		application.app.controllers.home.getCompleteUserQuestionaires(application, req, res);
	});

	application.get('/get_last_complete_user_questionaire', function(req, res){
		application.app.controllers.home.getLastCompleteUserQuestionaire(application, req, res);
	});

	application.post('/save_incomplete_user_questionaire', function(req, res){
		application.app.controllers.home.saveIncompleteUserQuestionaire(application, req, res);
	});

	application.post('/save_complete_user_questionaire', function(req, res){
		application.app.controllers.home.saveCompleteUserQuestionaire(application, req, res);
	});

}
