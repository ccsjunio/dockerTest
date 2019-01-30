module.exports.index = function(application, req, res){

	if(req.session.authorized === undefined){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.getTemplateForHome(req, res);

}

module.exports.dashboard = function(application, req, res){

	if(!req.session.authorized){
		return res.render('index',{target:"dashboard",validation:[{msg:"É preciso logar para acessar a página!"}],message:{}});
	}

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.getHomePage(req, res);

}

module.exports.getIncompleteUserQuestionaire = function(application, req, res){

	if(req.session.authorized === undefined){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para acessar estes dados!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para acessar estes dados!"},message:{}});
	}

    var UserQuestionairesDAO = new application.app.models.UserQuestionairesDAO();

    UserQuestionairesDAO.getIncompleteUserQuestionaire(req, res);//get incomplete user questionaire for this user logged in this session

}

module.exports.getCompleteUserQuestionaires = function(application, req, res){

	if(req.session.authorized === undefined){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para acessar estes dados!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para acessar estes dados!"},message:{}});
	}

    var UserQuestionairesDAO = new application.app.models.UserQuestionairesDAO();

    UserQuestionairesDAO.getCompleteUserQuestionaires(req, res);//get complete user questionaires for this user logged in this session

}

module.exports.getLastCompleteUserQuestionaire = function(application, req, res){

	if(!req.session.authorized){
		res.status(401).render('index',{target:"dashboard",validation:{msg:"É preciso logar para acessar estes dados!"},message:{}});
	}

  var UserQuestionairesDAO = new application.app.models.UserQuestionairesDAO();

  UserQuestionairesDAO.getLastCompleteUserQuestionaireJSON(req, res);//get last complete user questionaire for this user logged in this session

}

module.exports.summaryIndex = function(application, req, res){

	if(req.session.authorized === undefined){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para acessar estes dados!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para acessar estes dados!"},message:{}});
	}

    var UserQuestionairesDAO = new application.app.models.UserQuestionairesDAO();

    UserQuestionairesDAO.getLastCompleteUserQuestionaire(req, res);//get last complete user questionaire for this user logged in this session

}

module.exports.saveIncompleteUserQuestionaire = function(application, req, res){

	if(req.session.authorized === undefined){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para realizar a gravação!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para realizar a gravação!"},message:{}});
	}

    var UserQuestionairesDAO = new application.app.models.UserQuestionairesDAO();

    UserQuestionairesDAO.saveIncompleteUserQuestionaire(req.body,req, res);//save incomplete user questionaire for this user logged in this session

}

module.exports.saveCompleteUserQuestionaire = function(application, req, res){

	if(req.session.authorized === undefined){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para realizar a gravação!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"home",validation:{msg:"É preciso logar para realizar a gravação!"},message:{}});
	}

    var UserQuestionairesDAO = new application.app.models.UserQuestionairesDAO();

    UserQuestionairesDAO.saveCompleteUserQuestionaire(req.body,req, res);//save incomplete user questionaire for this user logged in this session

}

module.exports.moneyIndex = function(application, req, res){

    if(req.session.authorized === undefined){
		res.render('index',{target:"money",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"money",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.getTemplateForMoney(req, res);

}

module.exports.timeIndex = function(application, req, res){

	if(req.session.authorized === undefined){
		res.render('index',{target:"time",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"time",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.getTemplateForTime(req, res);

}

module.exports.knowledgeIndex = function(application, req, res){

    if(req.session.authorized === undefined){
		res.render('index',{target:"knowledge",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"knowledge",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.getTemplateForKnowledge(req, res);

}

module.exports.healthIndex = function(application, req, res){


	if(req.session.authorized === undefined){
		res.render('index',{target:"health",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"health",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.getTemplateForHealth(req, res);

}

module.exports.emotionIndex = function(application, req, res){

    if(req.session.authorized === undefined){
		res.render('index',{target:"emotion",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"emotion",validation:{msg:"É preciso logar para acessar a página!"},message:{}});
	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.getTemplateForEmotion(req, res);

}
