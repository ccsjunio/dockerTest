module.exports.money = function(application, req, res){

    if(!req.session.authorized){
  		return res.render('index',{target:"questionaire/money",validation:[{msg:"É preciso logar para acessar a página!"}],message:[]});
  	}

    let QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    let resource = {
      resourceName : {
        en:"money",
        pt:"dinheiro"
      }
    }

    QuestionairesTemplatesDAO.getTemplateForResource(resource, req, res);

}

module.exports.time = function(application, req, res){

    if(!req.session.authorized){
  		return res.render('index',{target:"questionaire/time",validation:[{msg:"É preciso logar para acessar a página!"}],message:[]});
  	}

    let QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    let resource = {
      resourceName : {
        en:"time",
        pt:"tempo"
      }
    }

    QuestionairesTemplatesDAO.getTemplateForResource(resource, req, res);

}

module.exports.knowledge = function(application, req, res){

    if(!req.session.authorized){
  		return res.render('index',{target:"questionaire/knowledge",validation:[{msg:"É preciso logar para acessar a página!"}],message:[]});
  	}

    let QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    let resource = {
      resourceName : {
        en:"knowledge",
        pt:"conhecimento"
      }
    }

    QuestionairesTemplatesDAO.getTemplateForResource(resource, req, res);

}

module.exports.health = function(application, req, res){

    if(!req.session.authorized){
  		return res.render('index',{target:"questionaire/health",validation:[{msg:"É preciso logar para acessar a página!"}],message:[]});
  	}

    let QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    let resource = {
      resourceName : {
        en:"health",
        pt:"saúde"
      }
    }

    QuestionairesTemplatesDAO.getTemplateForResource(resource, req, res);

}

module.exports.emotion = function(application, req, res){

    if(!req.session.authorized){
  		return res.render('index',{target:"questionaire/emotion",validation:[{msg:"É preciso logar para acessar a página!"}],message:[]});
  	}

    let QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    let resource = {
      resourceName : {
        en:"emotion",
        pt:"emoção"
      }
    }

    QuestionairesTemplatesDAO.getTemplateForResource(resource, req, res);

}

module.exports.updateMoney = function(application, req, res){

    if(!req.session.authorized){
  		res.render('index',{target:"questionaire/money",validation:{msg:"É preciso logar para acessar este serviço!"},message:{}});
  	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.updateMoneyQuestionaire(req, res);

}

module.exports.updateHealth = function(application, req, res){

    if(!req.session.authorized){
  		res.render('index',{target:"questionaire/health",validation:{msg:"É preciso logar para acessar este serviço!"},message:{}});
  	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.updateHealthQuestionaire(req, res);

}

module.exports.updateKnowledge = function(application, req, res){

    if(!req.session.authorized){
  		res.render('index',{target:"questionaire/knowledge",validation:{msg:"É preciso logar para acessar este serviço!"},message:{}});
  	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.updateKnowledgeQuestionaire(req, res);

}

module.exports.updateTime = function(application, req, res){

    if(!req.session.authorized){
  		res.render('index',{target:"questionaire/time",validation:{msg:"É preciso logar para acessar este serviço!"},message:{}});
  	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.updateTimeQuestionaire(req, res);

}

module.exports.updateEmotion = function(application, req, res){

    if(!req.session.authorized){
  		res.render('index',{target:"questionaire/emotion",validation:{msg:"É preciso logar para acessar este serviço!"},message:{}});
  	}

    var QuestionairesTemplatesDAO = new application.app.models.QuestionairesTemplatesDAO();

    QuestionairesTemplatesDAO.updateEmotionQuestionaire(req, res);

}
