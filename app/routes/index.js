module.exports = function(application){
	application.get('/', function(req, res){
		application.app.controllers.index.index(application, req, res);
	});

	application.get('/signedup', function(req, res){
		application.app.controllers.index.signedup(application, req, res);
	});

	application.post('/authenticate', function(req, res) {
		application.app.controllers.index.authenticate(application, req, res);
	});

	application.get('/forgotPassword', function(req, res) {
		application.app.controllers.index.forgotPassword(application, req, res);
	});

	application.get('/checkChangePasswordKey/:key', function(req, res) {
		application.app.controllers.index.checkChangePasswordKey(application, req, res);
	});

	application.post('/changePassword', function(req, res) {
		application.app.controllers.index.changePassword(application, req, res);
	});

	application.get('/passwordChanged', function(req, res) {
		application.app.controllers.index.passwordChanged(application, req, res);
	});

	application.post('/sendInstructions', function(req, res) {
		application.app.controllers.index.sendInstructions(application, req, res);
	});

	application.get('/logout', function(req, res) {
		application.app.controllers.index.logout(application, req, res);
	});

}
