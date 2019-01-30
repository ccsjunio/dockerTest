module.exports = function(application){
	application.get('/spec-runner', function(req, res){
		console.log("chegou no rooter1");
		application.app.controllers.unit_test.spec_runner.spec_runner(application, req, res);
	});

	application.get('/spec_runner', function(req, res){
		console.log("chegou no rooter 2");
		application.app.controllers.unit_test.spec_runner.spec_runner(application, req, res);
	});
}
