module.exports = function(application){
	application.get('/tools/simulator', function(req, res){
		application.app.controllers.tools.simulator(application, req, res);
	});

	application.get('/tools/projection', function(req, res){
		application.app.controllers.tools.projection(application, req, res);
	});
}

