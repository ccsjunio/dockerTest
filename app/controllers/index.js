module.exports.index = function(application, req, res){
    res.render('index', {validation:{}, message:{}, target:"home"});
}

module.exports.passwordChanged = function(application, req, res){
    res.render('index', {validation:{}, message:[{msg:"Senha alterada com sucesso. Você já pode utilizá-la para um novo login."}], target:"home"});
}

module.exports.forgotPassword = function(application, req, res){
    res.render('forgotPassword', {validation:{}, message:{}, target:"index"});
}

module.exports.checkChangePasswordKey = function(application, req, res){

  var changePasswordKey = req.params.key;

  console.log("changePasswordKey received:");
  console.log(changePasswordKey);

  //check if changePasswordKey is validation
  var UsersDAO = new application.app.models.UsersDAO();

  UsersDAO.checkChangePasswordKey(changePasswordKey, req, res);

}

module.exports.signedup = function(application, req, res){
    res.render('index', {validation:{}, message:[{msg:'Seu cadastro foi efetuado com sucesso! Você precisa confirmar seu cadastro pelo link enviado no e-mail para logar!'}], target:"home"});
}

module.exports.authenticate = function(application, req, res){

    var formData = req.body;

    req.assert('email', 'O e-mail não pode estar vazio!').notEmpty();
    req.assert('password', 'A senha não pode estar vazia!').notEmpty();

    var errors = req.validationErrors();

    if(errors){
    	res.render("index", {validation:errors, message:{}, target:"home"});
    }

    var encryptedPassword = application.crypto.createHash("md5").update(formData.password).digest("hex");

    formData.password = encryptedPassword;

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.authenticate(formData, req, res);

}

module.exports.changePassword = function(application, req, res){

    var formData = req.body;

    req.assert('password', 'A senha não pode estar vazia!').notEmpty();
    req.assert('passwordConfirmation', 'A confirmação de senha não pode estar vazia!').notEmpty();

    var errors = req.validationErrors();

    if(errors){
    	res.render("index", {validation:errors, message:{}, target:"home"});
    }

    var encryptedPassword = application.crypto.createHash("md5").update(formData.password).digest("hex");

    formData.password = encryptedPassword;

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.changePassword(formData, req, res);

}

module.exports.sendInstructions = function(application, req, res){

    var formData = req.body;

    req.assert('email', 'O e-mail não pode estar vazio!').notEmpty();
    req.check('email', 'O formato do e-mail não está correto!').isEmail();
    req.sanitize('email').trim();

    var errors = req.validationErrors();

    if(errors){
      var errorsMarkup = "<ul>";
        for(var e in errors){
          errorsMarkup += "<li>"+errors[e].msg+"</li>";
        }
      errorsMarkup += "</ul>";
    	res.json({success:false,errorMessage:'Houveram erros ao requisitar o envio de instruções para a troca de senha.<br> ' + errorsMarkup});
    }

    //email tested and sanitized. can send to model to check if exists and send email with instructions

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.sendInstructionsToChangePassword(formData, req, res);

}

module.exports.logout = function(application, req, res){

    req.session.destroy();

    res.render("index",{validation:{},message:{},target:""});

}
