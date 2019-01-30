module.exports.user_profile = function(application, req, res){
    
	if(!req.session.authorized){
		return res.render('index',{target:"user-profile",validation:[{msg:"É preciso logar para acessar a página!"}],message:{}});
	}

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.getUserProfilePage(req, res);

}

module.exports.user_profile_settings = function(application, req, res){
    
	if(!req.session.authorized){
		return res.status(401).render('index',{target:"user-profile-settings",validation:[{msg:"É preciso logar para acessar a página!"}],message:{}});
	}

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.getUserProfileSettingsPage(req, res);

}

module.exports.upload_user_avatar = function(application, req, res){
	
	if(req.session.authorized === undefined){
		res.render('index',{target:"user-profile-settings",validation:[{msg:"É preciso logar para acessar esta funcionadidade!"}],message:[]});
	}

	if(req.session.authorized === false){
		res.render('index',{target:"user-profile-settings",validation:[{msg:"É preciso logar para acessar esta funcionalidade!"}],message:[]});
	}

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.uploadUserAvatar(req, res);

}

module.exports.update_user_profile_data = function(application, req, res){
	
	if(req.session.authorized === undefined){
		return res.status(401).render('index',{target:"user-profile-settings",validation:[{msg:"É preciso logar para acessar esta funcionadidade!"}],message:[]});
	}

	if(req.session.authorized === false){
		return res.status(401).render('index',{target:"user-profile-settings",validation:[{msg:"É preciso logar para acessar esta funcionalidade!"}],message:[]});
	}

	var formData = req.body;

    req.assert('email', 'O e-mail não pode estar vazio!').notEmpty();
    req.assert('name', 'O nome não pode estar vazio!').notEmpty();
    req.assert('birthday', 'A data de nascimento não pode estar vazia!').notEmpty();

    var errors = req.validationErrors();

    if(errors){
    	res.status(401).json({"success":false,"errorMessage":"Erro de validação de dados dos campos enviados",errors:errors});
    }

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.updateUserProfileData(formData, req, res);

}