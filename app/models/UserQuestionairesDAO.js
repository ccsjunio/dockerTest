function UserQuestionairesDAO(){

    this._crypto = require('crypto');
	this._api_address = process.env.ENV_API_ADDRESS !== undefined ? process.env.ENV_API_ADDRESS : null;

	if(!this._api_address){
		res.render("errors/500",{success:false, errorMessage:'erro ao obter o endereço da API nas variáveis de ambiente'});
	}

	this._axios = require('axios');

}

UserQuestionairesDAO.prototype.getIncompleteUserQuestionaire = function(req, res){

	var userId = req.session.userId;

	this._axios({
		method: 'GET',
		url: this._api_address + '/GET_INCOMPLETE_USER_QUESTIONAIRE/' + userId
	})
	.then(function({data}){

		if(data.success){
			req.session.incompleteUserQuestionaire = data.userQuestionaire[0];
			res.json(data);
		}

	})
	.catch(function(error){
		res.render("errors/500",{success:false, errorMessage:'erro no processo de obtenção do questionário incompleto do usuário', error: error});
	});

}

UserQuestionairesDAO.prototype.getCompleteUserQuestionaires = function(req, res){

	var userId = req.session.userId;

	this._axios({
		method: 'GET',
		url: this._api_address + '/GET_COMPLETE_USER_QUESTIONAIRES/' + userId
	})
	.then(function({data}){

		if(data.success){
			req.session.completeUserQuestionaires = data.userQuestionaires;
			res.json(data);
		}

	})
	.catch(function(error){
		console.log(error);
		res.render("errors/500",{success:false, errorMessage:'erro no processo de obtenção dos questionários completos do usuário', error: error});
	});

}

UserQuestionairesDAO.prototype.getLastCompleteUserQuestionaire = function(req, res){

	var userId = req.session.userId;

	var axios = require("axios");

	var api = process.env.ENV_API_ADDRESS !== undefined ? process.env.ENV_API_ADDRESS : null;

	var getLastCompleteUserQuestionaire = function(){
		return axios.get(api+'/GET_LAST_COMPLETE_USER_QUESTIONAIRE/'+userId);
	};

	var getResourcesLayoutData = function(){
		return axios.get(api+'/GET_RESOURCES_LAYOUT_DATA');
	};

	axios.all([getLastCompleteUserQuestionaire(),getResourcesLayoutData()])
	.then(axios.spread(function(dataLastQuestionaire,dataResourcesLayoutData){

		if(dataLastQuestionaire.data.success && dataResourcesLayoutData.data.success){

			req.session.lastCompleteUserQuestionaire = dataLastQuestionaire.data.userQuestionaire.length==0 ? {} :  dataLastQuestionaire.data.userQuestionaire;
			req.session.resourcesLayoutData = dataResourcesLayoutData.data.resourcesLayoutData.length==0? {} : dataResourcesLayoutData.data.resourcesLayoutData[0];
			//res.json({resourcesLayoutData:req.session.resourcesLayoutData,lastCompleteUserQuestionaire:req.session.lastCompleteUserQuestionaire});
			res.render('home',{userQuestionaire:req.session.lastCompleteUserQuestionaire,target:'summary',sessionId:req.sessionID,session:req.session,resourcesLayoutData:req.session.resourcesLayoutData});

		}

	}))
	.catch(function(error){
				console.log(error);
				res.status(500).render("errors/500",{success:false,errorMessage:'erro no processo de obtenção dos dados de layout dos recursos', error:error});
	});


}

UserQuestionairesDAO.prototype.getLastCompleteUserQuestionaireJSON = function(req, res){

	var userId = req.session.userId;

	var axios = require("axios");

	var api = process.env.ENV_API_ADDRESS !== undefined ? process.env.ENV_API_ADDRESS : null;

	var getLastCompleteUserQuestionaire = function(){
		return axios.get(api+'/GET_LAST_COMPLETE_USER_QUESTIONAIRE/'+userId);
	};

	var getResourcesLayoutData = function(){
		return axios.get(api+'/GET_RESOURCES_LAYOUT_DATA');
	};

	axios.all([getLastCompleteUserQuestionaire(),getResourcesLayoutData()])
	.then(axios.spread(function(dataLastQuestionaire,dataResourcesLayoutData){

		if(dataLastQuestionaire.data.success && dataResourcesLayoutData.data.success){

			req.session.lastCompleteUserQuestionaire = dataLastQuestionaire.data.userQuestionaire.length==0 ? {} :  dataLastQuestionaire.data.userQuestionaire;
			req.session.resourcesLayoutData = dataResourcesLayoutData.data.resourcesLayoutData.length==0? {} : dataResourcesLayoutData.data.resourcesLayoutData[0];
			//res.json({resourcesLayoutData:req.session.resourcesLayoutData,lastCompleteUserQuestionaire:req.session.lastCompleteUserQuestionaire});
			res.status(200).json({userQuestionaire:req.session.lastCompleteUserQuestionaire,resourcesLayoutData:req.session.resourcesLayoutData});

		}

	}))
	.catch(function(error){
				console.log(error);
				res.status(500).render("errors/500",{success:false,errorMessage:'erro no processo de obtenção dos dados de layout dos recursos', error:error});
	});


}

UserQuestionairesDAO.prototype.saveIncompleteUserQuestionaire = function(incompleteUserQuestionaire, req, res){

	var userId = req.session.userId;
	var sessionId = req.sessionID;

	this._axios({
		method: 'POST',
		url: this._api_address + '/SAVE_INCOMPLETE_USER_QUESTIONAIRE/' + userId,
		data:{incompleteUserQuestionaire:incompleteUserQuestionaire,sessionId:sessionId}
	})
	.then(function({data}){

		if(data.success){
			req.session.incompleteUserQuestionaire = data.userQuestionaire[0];
			res.json(data);
		}


	})
	.catch(function(error){
		console.log(error);
		res.render("errors/500",{success:false, errorMessage:'erro no processo de gravação do questionário incompleto do usuário', error: error});
	});

}

UserQuestionairesDAO.prototype.saveCompleteUserQuestionaire = function(completeUserQuestionaire, req, res){

	var userId = req.session.userId;
	var sessionId = req.sessionID;

	console.log("data received by model userQuestionairesDAO:");
	console.log(completeUserQuestionaire);

	this._axios({
		method: 'POST',
		url: this._api_address + '/SAVE_COMPLETE_USER_QUESTIONAIRE/' + userId,
		data:{completeUserQuestionaire:completeUserQuestionaire,sessionId:sessionId}
	})
	.then(function({data}){

		if(data.success){
			req.session.completeUserQuestionaire = data.userQuestionaire[0];
			res.json(data);
		}

	})
	.catch(function(error){
		console.log(error);
		res.render("errors/500",{success:false, errorMessage:'erro no processo de gravação do questionário completo do usuário', error: error});
	});

}

module.exports = function(){
    return UserQuestionairesDAO;
}
