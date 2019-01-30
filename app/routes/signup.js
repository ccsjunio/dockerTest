module.exports = function(application){

	application.get('/signup', function(req, res){
		application.app.controllers.signup.index(application, req, res);
	});

	application.post('/signup', function(req, res) {
		application.app.controllers.signup.signup(application, req, res);
	});

	application.get('/confirmSignup/:authenticationToken', function(req, res) {
		application.app.controllers.signup.confirmSignup(application, req, res);
	});

	application.get('/removeUnauthorizedSignup/:authenticationToken', function(req, res) {
		application.app.controllers.signup.removeUnauthorizedSignup(application, req, res);
	});

}
