module.exports.index = function(application, req, res){
    res.render('signup',{validation:{}, message:{}});

}

module.exports.signup = function(application, req, res){

    var formData = req.body;

    req.assert('email', 'O e-mail não pode estar vazio!').notEmpty();
    req.assert('name', 'O nome não pode estar vazio!').notEmpty();
    req.assert('birthday', 'A data de nascimento não pode estar vazia!').notEmpty();
    req.assert('password', 'A senha não pode estar vazia!').notEmpty();

    var errors = req.validationErrors();

    if(errors){
    	res.render("signup", {validation:errors,message:{}});
    }

    var encryptedPassword = application.crypto.createHash("md5").update(formData.password).digest("hex");
    var encryptedPasswordConfirmation = application.crypto.createHash("md5").update(formData.passwordConfirmation).digest("hex");

    formData.password = encryptedPassword;
    formData.passwordConfirmation = encryptedPasswordConfirmation;

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.signup(formData, req, res);

}

module.exports.confirmSignup = function(application, req, res){

    var authenticationToken = req.params.authenticationToken;

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.confirmSignup(authenticationToken, req, res);

}

module.exports.removeUnauthorizedSignup = function(application, req, res){

    var authenticationToken = req.params.authenticationToken;

    var UsersDAO = new application.app.models.UsersDAO();

    UsersDAO.removeUnauthorizedSignup(authenticationToken, req, res);

}
