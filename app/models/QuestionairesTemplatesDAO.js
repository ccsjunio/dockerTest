function QuestionairesTemplatesDAO(){

  this._crypto = require('crypto');
	this._api_address = process.env.ENV_API_ADDRESS !== undefined ? process.env.ENV_API_ADDRESS + '/GET_QUESTIONAIRE_TEMPLATE' : null;

	if(!this._api_address){
		res.render("errors/500",{success:false, errorMessage:'erro ao obter o endereço da API nas variáveis de ambiente'});
	}

	this._axios = require('axios');

}

//remember to close connection for each prototype

QuestionairesTemplatesDAO.prototype.create = function(user){}

QuestionairesTemplatesDAO.prototype.getTemplateForHome = function(req, res){

	this._axios({
		method: 'GET',
		url: this._api_address,
	})
	.then(function({data}){

		if(data.success){
			req.session.questionaireTemplate = data.questionaireTemplate[0];
			res.render('home',{questionaireTemplate:req.session.questionaireTemplate,target:'home',sessionId:req.sessionID,session:req.session});
		}


	})
	.catch(function(error){
		console.log(error);
		res.render("errors/500",{success:false, errorMessage:'erro no processo de obtenção do template do questionário (getTemplateForHome)', error: error});
	});

}

QuestionairesTemplatesDAO.prototype.getTemplateForResource = function(resourceParam, req, res){

  const userId = req.session.userId;
  const moment = require('moment');
  let axios = require("axios");
  //resourceName = resource.name.toLowerCase();
  const resourceName = resourceParam.resourceName;

  let getQuestionaireTemplate = function(){
    return axios.get(process.env.ENV_API_ADDRESS + '/GET_QUESTIONAIRE_TEMPLATE');
  };

  let getIncompleteUserQuestionaire = function(){
    return axios.get(process.env.ENV_API_ADDRESS + '/GET_INCOMPLETE_USER_QUESTIONAIRE/' + userId);
  };

  axios.all([getQuestionaireTemplate(), getIncompleteUserQuestionaire()])
  .then(axios.spread(function(dataQuestionaireTemplate,dataIncompleteUserQuestionaire){

    const questionaireTemplateRaw = dataQuestionaireTemplate.data;
    const incompleteUserQuestionaireRaw = dataIncompleteUserQuestionaire.data;

    if(questionaireTemplateRaw.success && incompleteUserQuestionaireRaw.success){
      //build html template for resource questionaire
      //search the questionaire
      const incompleteUserQuestionaire = incompleteUserQuestionaireRaw.userQuestionaire[0];
      console.log("incompleteUserQuestionaireRaw:::::::::");
      console.log(incompleteUserQuestionaireRaw);
      const incompleteResources = incompleteUserQuestionaire !== undefined ? incompleteUserQuestionaire.resources : {};
      const questionaireTemplates = questionaireTemplateRaw.questionaireTemplate;
      const questionaireTemplateName = "Questionário Geral Público";
      let questionaireTemplateIndex;
      for(questionaireTemplateIndex in questionaireTemplates){
        //define the questionaire template index as the on which name is the same defined
        if(questionaireTemplates[questionaireTemplateIndex].name==questionaireTemplateName) break;
      }
      const questionaireTemplate = questionaireTemplates[questionaireTemplateIndex];

      let htmlMarkup = "";

      const resource = questionaireTemplate.resources[resourceName.en];
      const incompleteResource = incompleteResources[resourceName.en];

      let subResources;

        let visible = true;

        htmlMarkup += '<div class="section-block">';
        htmlMarkup +=   '<div resource="'+resourceName.pt+'" class="col">';
        htmlMarkup +=   '<form id="resourcesForm">';

          let subResourceName;
          subResources = resource.subresources;
          let order = 0;
          for(subResourceName in subResources){
            let arrayOfOptionsToAvoidExisting = [];
            let arrayOfOptionsToDoExisting = [];
            let arrayOfQuestionsScoredExisting = [];
            let subResource = subResources[subResourceName];
            subResourceName = subResourceName.toLowerCase();
            htmlMarkup +=   '<div class="row subresourceTitle" resource="'+resourceName.en+'" subresource="'+subResourceName+'">';
            htmlMarkup +=   '<h1>'+subResourceName+'<div class="tile tile-lg toggle_subresource_container" resource="'+resourceName.en+'" subresource="'+subResourceName+'" collapsed="true">';
            htmlMarkup +=     '<span class="fa fa-plus-square"></span></div>';
            htmlMarkup +=   '</h1>';
            htmlMarkup +=   '</div>';

            htmlMarkup +=   '<div class="subResourceContainer" resource="'+resourceName.en+'" subresource="'+subResourceName+'" style="display:none;">';

            let topic;

            /* what-to-avoid-container---------------------------------------- */
            topic = 'o_que_evitar';
            htmlMarkup +=   '<div class="what-to-avoid-container" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'">';
            htmlMarkup +=     '<h3  resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'" class="what-to-avoid" style="color:#ea6759;">Ações a Evitar';
            htmlMarkup +=       '<span class="savingMessage"></span>';
            htmlMarkup +=     '</h3>';
            htmlMarkup +=     '<fieldset style="border-radius:10px;border:1px solid #ea6759;padding:10px;margin:10px;" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="o_que_evitar">';
            htmlMarkup +=     '<div class="actionsContainer" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="o_que_evitar">';

            if(incompleteResource!==undefined){
              if(incompleteResource[subResourceName]!==undefined){
                let whatToAvoidIncompleteList = incompleteResource[subResourceName].o_que_evitar;

                for(let index in whatToAvoidIncompleteList){
                  let element = whatToAvoidIncompleteList[index];
                  let option = element.option.toLowerCase();
                  let order = element.order;
                  let originalValue = element.originalValue.toLowerCase();
                  arrayOfOptionsToAvoidExisting.push(originalValue);
                  //build new input line markup
                  let newInput = '';
                  newInput +=     '<div class="row">';
                  newInput +=       '<div class="form-group col-sm-12">';
                  newInput +=         '<div class="input-group input-group-alt">';
                  newInput +=           '<input type="text" value="'+option+'" originalValue="'+originalValue+'" class="form-control" name="what_to_avoid[]" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="o_que_evitar" order="'+order+'" disabled aria-describedby="button-addon-'+order+'" temporary="false">';
                  newInput +=           '<div class="input-group-append">';
                  newInput +=             '<button type="button" class="btn btn-danger" id="button-addon-'+order+'" order="'+order+'" resource="'+resourceName.en+'" subresource="'+subResourceName+'" originalValue="'+originalValue+'" topic="'+topic+'" action="remove_action">Remover esta ação</button>';
                  newInput +=           '</div>';
                  newInput +=         '</div>';//input-group
                  newInput +=       '</div>';//form-group
                  newInput +=     '</div>';//row
                  htmlMarkup += newInput;
                }
              }
            }


            htmlMarkup +=     '</div>';//actionsContainer

            htmlMarkup +=     '<div class="row">';
            htmlMarkup +=       '<div class="form-group col-sm-4">';
            htmlMarkup +=         '<div class="input-group">';
            htmlMarkup +=           '<select class="custom-select" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="o_que_evitar" >';
            htmlMarkup +=             '<option value="" selected>escolha uma ou escreva a sua</option>'
            const o_que_evitar = subResource.o_que_evitar ? subResource.o_que_evitar : [];
            for(let index=0;index<o_que_evitar.length;index++){
              let option = o_que_evitar[index].option.toLowerCase();
              let disableMarkup = '';
              if(arrayOfOptionsToAvoidExisting.indexOf(option)!==-1){
                disableMarkup = 'disabled'
              }//if(arrayOfOptionsExisting.indexOf(option)!==-1)
              htmlMarkup +=           '<option value="'+option+'" '+disableMarkup+'>'+option.toLowerCase()+'</option>';
            }//for(let index=0;index<o_que_evitar.length;index++)
            htmlMarkup +=          '</select>';
            htmlMarkup +=       '</div>';//class="input-group"
            htmlMarkup +=     '</div>';//class="form-group"

            htmlMarkup +=     '<div class="form-group col-sm-8">';
            htmlMarkup +=       '<div class="input-group input-group-alt">';
            htmlMarkup +=         '<input type="text" class="form-control" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="o_que_evitar" order="0" temporary="true">';
            htmlMarkup +=         '<div class="input-group-append">';
            htmlMarkup +=           '<button type="button" class="btn btn-success" id="button-addon-0" resource="'+resourceName.en+'" subresource="'+subResourceName+'" order="0" topic="'+topic+'" action="add_action">Adicionar esta ação</button>';
            htmlMarkup +=         '</div>';
            htmlMarkup +=       '</div>';
            htmlMarkup +=     '</div>';
            htmlMarkup +=   '</div>'//end of row from what to avoid
            htmlMarkup += '</fieldset>';//end of what to avoid
            htmlMarkup += '</div>'//end of what-to-avoid-container
            /* what-to-avoid-container---------------------------------------- */

            /* what-to-do-container---------------------------------------- */
            topic = 'o_que_fazer';
            htmlMarkup +=   '<div class="what-to-do-container" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'">';
            htmlMarkup +=     '<h3  resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'" class="what-to-do" style="color:#595bea;">Ações a Realizar';
            htmlMarkup +=       '<span class="savingMessage"></span>';
            htmlMarkup +=     '</h3>';
            htmlMarkup +=     '<fieldset style="border-radius:10px;border:1px solid #595bea;padding:10px;margin:10px;" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'">';

            htmlMarkup +=     '<div class="actionsContainer" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'">';

            if(incompleteResource!==undefined){
              if(incompleteResource[subResourceName]!==undefined){
                let whatToDoIncompleteList = incompleteResource[subResourceName].o_que_fazer;

                for(let index in whatToDoIncompleteList){
                  let element = whatToDoIncompleteList[index];
                  let option = element.option.toLowerCase();
                  let order = element.order;
                  let originalValue = element.originalValue.toLowerCase();
                  arrayOfOptionsToDoExisting.push(originalValue.toLowerCase());
                  //build new input line markup
                  let newInput = '';
                  newInput +=     '<div class="row">';
                  newInput +=       '<div class="form-group col-sm-12">';
                  newInput +=         '<div class="input-group input-group-alt">';
                  newInput +=           '<input type="text" value="'+option+'" originalValue="'+originalValue+'" class="form-control" name="what_to_do[]" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'" order="'+order+'" disabled aria-describedby="button-addon-'+order+'" temporary="false">';
                  newInput +=           '<div class="input-group-append">';
                  newInput +=             '<button type="button" class="btn btn-danger" id="button-addon-'+order+'" order="'+order+'" resource="'+resourceName.en+'" subresource="'+subResourceName+'" originalValue="'+originalValue+'" topic="'+topic+'" action="remove_action">Remover esta ação</button>';
                  newInput +=           '</div>';
                  newInput +=         '</div>';//input-group
                  newInput +=       '</div>';//form-group
                  newInput +=     '</div>';//row
                  htmlMarkup += newInput;
                }
              }
            }

            htmlMarkup +=     '</div>';//actionsContainer

            htmlMarkup +=     '<div class="row">';
            htmlMarkup +=       '<div class="form-group col-sm-4">';
            htmlMarkup +=         '<div class="input-group">';
            htmlMarkup +=           '<select class="custom-select" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'" action="add_action" >';
            htmlMarkup +=             '<option value="" selected>escolha uma ou escreva a sua</option>'
            const o_que_fazer = subResource.o_que_fazer ? subResource.o_que_fazer : [];
            for(let index=0;index<o_que_fazer.length;index++){
              let option = (o_que_fazer[index].option).toLowerCase();
              let disableMarkup = '';
              if(arrayOfOptionsToDoExisting.indexOf(option)!==-1){
                disableMarkup = 'disabled'
              }//if(arrayOfOptionsExisting.indexOf(option)!==-1)
              htmlMarkup +=           '<option value="'+option+'" '+disableMarkup+'>'+option+'</option>';
            }//for(let index=0;index<o_que_evitar.length;index++)
            htmlMarkup +=          '</select>';
            htmlMarkup +=       '</div>';//class="input-group"
            htmlMarkup +=     '</div>';//class="form-group"

            htmlMarkup +=     '<div class="form-group col-sm-8">';
            htmlMarkup +=       '<div class="input-group input-group-alt">';
            htmlMarkup +=         '<input type="text" class="form-control" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'" order="0" temporary="true">';
            htmlMarkup +=         '<div class="input-group-append">';
            htmlMarkup +=           '<button type="button" class="btn btn-success" id="button-addon-0" resource="'+resourceName.en+'" subresource="'+subResourceName+'" order="0" topic="'+topic+'" action="add_action">Adicionar esta ação</button>';
            htmlMarkup +=         '</div>';
            htmlMarkup +=       '</div>';
            htmlMarkup +=     '</div>';
            htmlMarkup +=   '</div>'//end of row from what to avoid
            htmlMarkup += '</fieldset>';//end of what to avoid
            htmlMarkup += '</div>'//end of what-to-avoid-container
            /* what-to-do-container---------------------------------------- */

            /* questionaire-container---------------------------------------- */
            topic = 'questionaire';
            htmlMarkup +=   '<div class="questionaire-container" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'">';
            htmlMarkup +=     '<h3  resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'" class="'+topic+'" style="color:#00a28a;">Auto-avaliação';
            htmlMarkup +=       '<span class="savingMessage"></span>';
            htmlMarkup +=     '</h3>';
            htmlMarkup +=     '<fieldset style="border-radius:10px;border:1px solid #00a28a;padding:10px;margin:10px;" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'">';

            const questionaire = subResource.questionaire ? subResource.questionaire : [];
            const questionaireIncomplete = incompleteResource!==undefined ? incompleteResource[subResourceName].questionaire : [];

            for(let index in questionaire){
              let element = questionaire[index];
              let order = element.order;
              let question = element.question;
              let score;
              //check if there is a response for this question
              for(let indexQuestionaire in questionaireIncomplete){
                let questionIncomplete = questionaireIncomplete[indexQuestionaire];
                if(+questionIncomplete.order==+order){
                  score = questionIncomplete.score;
                  break;
                } else {
                  score = "";
                }
              }
              htmlMarkup +=     '<div class="row">';
              htmlMarkup +=       '<div class="form-group col-sm-12">';
              htmlMarkup +=         '<div class="input-group">';
              htmlMarkup +=           '<label class="input-group-prepend" for="pi4">';
              htmlMarkup +=             '<span class="input-group-text">'+question.toLowerCase()+'</span>';
              htmlMarkup +=           '</label> ';
              htmlMarkup +=           '<input value="'+score+'" order="'+order+'" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'" type="number" min="0" max="10" step="0.01" class="form-control" placeholder="dê sua nota" temporary="true">';
              htmlMarkup +=           '<input value="'+score+'" order="'+order+'" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'" type="range" min="0" max="10" step="0.01" class="form-control" placeholder="dê sua nota" temporary="false">';
              htmlMarkup +=         '</div>';//class="input-group"
              htmlMarkup +=       '</div>';//class="form-group"
              htmlMarkup +=     '</div>'//end of row from questionaire
            }

            htmlMarkup +=   '</fieldset>';//end of questionaire
            htmlMarkup += '</div>'//end of questionaire-container
            /* questionaire-container---------------------------------------- */

            /* free-questionaire-container---------------------------------------- */
            topic = 'free_questionaire';
            htmlMarkup +=   '<div class="free-questionaire-container" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'">';
            htmlMarkup +=     '<h3  resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'" class="'+topic+'" style="color:#00a28a;">Frequências';
            htmlMarkup +=       '<span class="savingMessage"></span>';
            htmlMarkup +=     '</h3>';
            htmlMarkup +=     '<fieldset style="border-radius:10px;border:1px solid #00a28a;padding:10px;margin:10px;" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'">';

            const free_questionaire = subResource.free_questionaire ? subResource.free_questionaire : [];
            const free_questionaireIncomplete = incompleteResource!== undefined ? incompleteResource[subResourceName].free_questionaire: [];

            for(let index in free_questionaire){
              let element = free_questionaire[index];
              let order = element.order;
              let answers = element.answers;
              let question = element.question.toLowerCase();
              let answerOrderIncomplete;
              let answerTextIncomplete;
              //check if there is a response for this question
              for(let indexFreeQuestionaire in free_questionaireIncomplete){
                let free_questionIncomplete = free_questionaireIncomplete[indexFreeQuestionaire];
                if(+free_questionIncomplete.order==+order && free_questionIncomplete.question.toLowerCase() == question){
                  answerOrderIncomplete = free_questionIncomplete.answerOrder;
                  answerTextIncomplete = free_questionIncomplete.answerText;
                  break;
                } else {
                  answerOrderIncomplete = "";
                  answerTextIncomplete = "";
                }
              }

              htmlMarkup +=     '<div class="row">';
              htmlMarkup +=       '<div class="form-group col-sm-12">';
              htmlMarkup +=       '<label class="d-block h4">'+question+'</label>'

              for(let answerIndex in answers){
                let answerElement = answers[answerIndex];
                let answerOrder = answerElement.order;
                let answer = answerElement.answer.toLowerCase();
                let checkedMarkup = "";
                if(answer == answerTextIncomplete && answerOrder == answerOrderIncomplete){
                  checkedMarkup = "checked";
                }

                htmlMarkup +=         '<div class="custom-control custom-radio">';
                htmlMarkup +=           '<input '+checkedMarkup+' temporary="false" value="'+answerOrder+'" answerText="'+answer+'" question="'+question+'" questionOrder="'+order+'" order="'+order+'" resource="'+resourceName.en+'" subresource="'+subResourceName+'" topic="'+topic+'" type="radio" class="custom-control-input" name="free_questionaire_'+order+'_'+resourceName.en+'_'+subResourceName+'_'+topic+'" id="free_questionaire_'+order+'_'+resourceName.en+'_'+subResourceName+'_'+topic+'_'+answerOrder+'">';
                htmlMarkup +=           '<label class="custom-control-label" for="free_questionaire_'+order+'_'+resourceName.en+'_'+subResourceName+'_'+topic+'_'+answerOrder+'">'+answer+'</label>';
                htmlMarkup +=         '</div>';

              }

              htmlMarkup +=       '</div>';//class="form-group"
              htmlMarkup +=     '</div>'//end of row from free_questionaire

            }//for(let index in free_questionaire)

            htmlMarkup +=   '</fieldset>';//end of questionaire
            htmlMarkup += '</div>';//end of questionaire-container
            /* free-questionaire-container---------------------------------------- */

            htmlMarkup += '</div>';//end of subresourceContainer

          }//for(subResourceName in subResources)

        htmlMarkup += '</form>';//<form id="resourcesForm">
        htmlMarkup +=   '</div>';//div resource resourceName
        htmlMarkup += '</div>';//<div class="section-block">

      //end of build html template for resource questionaire

			res.render('questionaire/'+resourceName.en.toLowerCase(),{moment:moment,userData:req.session.userData,htmlMarkup:htmlMarkup});
    }

  }))
  .catch(function(error){
				console.log(error);
				res.status(500).render("errors/500",{success:false,errorMessage:'erro no processo de obtenção dos dados de template do questionário e dados de preenchimento do usuário', error:error});
	});

}

QuestionairesTemplatesDAO.prototype.updateMoneyQuestionaire = function(req, res){

  const userId = req.session.userId;
  const secret = 'PagrashaDiWahn';
  const hash = this._crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');
  const dataReceived = req.body;

  this._axios({
		method: 'PUT',
		url: process.env.ENV_API_ADDRESS + '/UPDATE_MONEY_QUESTIONAIRE',
    data: {questionaireData:dataReceived,key:hash,userId:userId}
	})
  .then(function({data}){
    return res.json({data:data});
  })
  .catch(function(error){
    return res.json({error:error.Error});
  })

}

QuestionairesTemplatesDAO.prototype.updateTimeQuestionaire = function(req, res){

  const userId = req.session.userId;
  const secret = 'PagrashaDiWahn';
  const hash = this._crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');
  const dataReceived = req.body;

  this._axios({
		method: 'PUT',
		url: process.env.ENV_API_ADDRESS + '/UPDATE_TIME_QUESTIONAIRE',
    data: {questionaireData:dataReceived,key:hash,userId:userId}
	})
  .then(function({data}){
    return res.json({data:data});
  })
  .catch(function(error){
    return res.json({error:error.Error});
  })

}

QuestionairesTemplatesDAO.prototype.updateKnowledgeQuestionaire = function(req, res){

  const userId = req.session.userId;
  const secret = 'PagrashaDiWahn';
  const hash = this._crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');
  const dataReceived = req.body;

  this._axios({
		method: 'PUT',
		url: process.env.ENV_API_ADDRESS + '/UPDATE_KNOWLEDGE_QUESTIONAIRE',
    data: {questionaireData:dataReceived,key:hash,userId:userId}
	})
  .then(function({data}){
    return res.json({data:data});
  })
  .catch(function(error){
    return res.json({error:error.Error});
  })

}

QuestionairesTemplatesDAO.prototype.updateHealthQuestionaire = function(req, res){

  const userId = req.session.userId;
  const secret = 'PagrashaDiWahn';
  const hash = this._crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');
  const dataReceived = req.body;

  this._axios({
		method: 'PUT',
		url: process.env.ENV_API_ADDRESS + '/UPDATE_HEALTH_QUESTIONAIRE',
    data: {questionaireData:dataReceived,key:hash,userId:userId}
	})
  .then(function({data}){
    return res.json({data:data});
  })
  .catch(function(error){
    return res.json({error:error.Error});
  })

}

QuestionairesTemplatesDAO.prototype.updateEmotionQuestionaire = function(req, res){

  const userId = req.session.userId;
  const secret = 'PagrashaDiWahn';
  const hash = this._crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');
  const dataReceived = req.body;

  this._axios({
		method: 'PUT',
		url: process.env.ENV_API_ADDRESS + '/UPDATE_EMOTION_QUESTIONAIRE',
    data: {questionaireData:dataReceived,key:hash,userId:userId}
	})
  .then(function({data}){
    return res.json({data:data});
  })
  .catch(function(error){
    return res.json({error:error.Error});
  })

}

QuestionairesTemplatesDAO.prototype.getTemplateForKnowledge = function(req, res){

	this._axios({
		method: 'GET',
		url: this._api_address,
	})
	.then(function({data}){
		if(data.success){
			req.session.questionaireTemplate = data.questionaireTemplate[0];
			res.render('home',{questionaireTemplate:req.session.questionaireTemplate,target:'knowledge',sessionId:req.sessionID,session:req.session});
		}
	})
	.catch(function(error){
		res.render("errors/500",{success:false, errorMessage:'erro no processo de obtenção do template do questionário (getTemplateForKnowledge)', error: error});
	});

}

QuestionairesTemplatesDAO.prototype.getTemplateForTime = function(req, res){

	this._axios({
		method: 'GET',
		url: this._api_address,
	})
	.then(function({data}){
		if(data.success){
			req.session.questionaireTemplate = data.questionaireTemplate[0];
			res.render('home',{questionaireTemplate:req.session.questionaireTemplate,target:'time',sessionId:req.sessionID,session:req.session});
		}
	})
	.catch(function(error){
		res.render("errors/500",{success:false, errorMessage:'erro no processo de obtenção do template do questionário (getTemplateForTime)', error: error});
	});

}

QuestionairesTemplatesDAO.prototype.getTemplateForHealth = function(req, res){

	this._axios({
		method: 'GET',
		url: this._api_address,
	})
	.then(function({data}){
		if(data.success){
			req.session.questionaireTemplate = data.questionaireTemplate[0];
			res.render('home',{questionaireTemplate:req.session.questionaireTemplate,target:'health',sessionId:req.sessionID,session:req.session});
		}
	})
	.catch(function(error){
		res.render("errors/500",{success:false, errorMessage:'erro no processo de obtenção do template do questionário (getTemplateForHealth)', error: error});
	});

}

QuestionairesTemplatesDAO.prototype.getTemplateForEmotion = function(req, res){

	this._axios({
		method: 'GET',
		url: this._api_address,
	})
	.then(function({data}){
		if(data.success){
			req.session.questionaireTemplate = data.questionaireTemplate[0];
			res.render('home',{questionaireTemplate:req.session.questionaireTemplate,target:'emotion',sessionId:req.sessionID,session:req.session});
		}
	})
	.catch(function(error){
		res.render("errors/500",{success:false, errorMessage:'erro no processo de obtenção do template do questionário (getTemplateForEmotion)', error: error});
	});

}

QuestionairesTemplatesDAO.prototype.delete = function(user){}

QuestionairesTemplatesDAO.prototype.update = function(user, req, res){}

QuestionairesTemplatesDAO.prototype.getOne = function(req, res){}

module.exports = function(){
    return QuestionairesTemplatesDAO;
}
