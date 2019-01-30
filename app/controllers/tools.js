module.exports.simulator = function(application, req, res){

	if(!req.session.authorized){
		return res.render('index',{target:"tools/simulator",validation:[{msg:"É preciso logar para acessar a página!"}],message:{}});
	}

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.getSimulatorPage(req, res);

}

module.exports.projection = function(application, req, res){

	if(!req.session.authorized){
		return res.render('index',{target:"tools/projection",validation:[{msg:"É preciso logar para acessar a página!"}],message:{}});
	}

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.getProjectionPage(req, res);

}