module.exports = function(application){

	application.get('/user-profile', function(req, res){
		application.app.controllers.user.user_profile(application, req, res);
	});

	application.get('/user-profile-settings', function(req, res){
		application.app.controllers.user.user_profile_settings(application, req, res);
	});

	application.post('/upload_user_avatar', function(req, res){
		application.app.controllers.user.upload_user_avatar(application, req, res);
	});

	application.post('/update_user_profile_data', function(req, res){
		application.app.controllers.user.update_user_profile_data(application, req, res);
	});

	

}