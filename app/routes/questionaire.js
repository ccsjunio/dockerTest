module.exports = function(application){

	application.get('/questionaire/money', function(req, res){
		application.app.controllers.questionaire.money(application, req, res);
	});

	application.put('/questionaire/money', function(req, res){

		application.app.controllers.questionaire.updateMoney(application, req, res);
	});

	application.get('/questionaire/time', function(req, res){
		application.app.controllers.questionaire.time(application, req, res);
	});

	application.put('/questionaire/time', function(req, res){

		application.app.controllers.questionaire.updateTime(application, req, res);
	});

	application.get('/questionaire/knowledge', function(req, res){
		application.app.controllers.questionaire.knowledge(application, req, res);
	});

	application.put('/questionaire/knowledge', function(req, res){

		application.app.controllers.questionaire.updateKnowledge(application, req, res);
	});

	application.get('/questionaire/health', function(req, res){
		application.app.controllers.questionaire.health(application, req, res);
	});

	application.put('/questionaire/health', function(req, res){

		application.app.controllers.questionaire.updateHealth(application, req, res);
	});

	application.get('/questionaire/emotion', function(req, res){
		application.app.controllers.questionaire.emotion(application, req, res);
	});

	application.put('/questionaire/emotion', function(req, res){

		application.app.controllers.questionaire.updateEmotion(application, req, res);
	});

}
