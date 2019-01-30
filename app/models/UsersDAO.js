function UsersDAO(){

    this._crypto = require('crypto');
	  this._api_address = process.env.ENV_API_ADDRESS !== undefined ? process.env.ENV_API_ADDRESS : '';

}

//remember to close connection for each prototype

UsersDAO.prototype.create = function(user){}

UsersDAO.prototype.authenticate = function(user, req, res){

	const axios = require('axios');
  const API_ADDRESS = process.env.ENV_API_ADDRESS;

	axios({
		method: 'POST',
		url: API_ADDRESS + '/AUTHENTICATE',
		data: user
	})
	.then(function({data}){
		var userData = data.userData;
		//user authenticated with success
		if(userData[0]!=undefined){

      if(userData[0].signup.signupAuthentication===false){
        const link = req.protocol + '://' + req.get('host') + '/resendSignUpConfirmationEmail/' + error.response.data.userData[0].email;
        const errorMessage = "Você ainda não se autenticou. " +
                            "Caso não esteja localizando o e-mail de autenticação, " +
                            "por favor, solicite um novo através deste link: <br/>" +
                            "<a href='" + link + "' target='_blank'>reenviar</a>";
        res.status(401).json({success:false,errorMessage:errorMessage});
      } else {
        req.session.userId = userData[0]._id.valueOf();
  			req.session.authorized = true;
  			req.session.userName = userData[0].name;
  			req.session.userEmail = userData[0].email;
  			req.session.userBirthday = userData[0].birthday;
  			req.session.incompleteUserQuestionaire = userData[0].incompleteUserQuestionaire? userData[0].incompleteUserQuestionaire: {};
        req.session.userData = userData[0];
      }

		} else {
			req.session.authorized = false;
			req.session.userName = null;
			req.session.userEmail = null;
			req.session.userBirthday = null;
		}

		res.status(200).json(data);
	})
	.catch(function(error){
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          const link = req.protocol + '://' + req.get('host') + '/resendSignUpConfirmationEmail/' + error.response.data.userData[0].email;
          errorMessage = "Você ainda não se autenticou. " +
                              "Caso não esteja localizando o e-mail de autenticação, " +
                              "por favor, solicite um novo através deste link: <br/>" +
                              "<a href='" + link + "' target='_blank'>reenviar</a>";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }


	});

}

UsersDAO.prototype.getUserProfilePage = function(req, res){

	const axios = require('axios');
  const API_ADDRESS = process.env.ENV_API_ADDRESS;
  const userId = req.session.userId;
  let userData;

	axios({
		method: 'GET',
    url: API_ADDRESS + '/GET_USER_DATA/' + userId
  })
	.then(function({data}){

		userData = data.userData;
		//user data aquired with success

    //render user-profile page sending user data toghether to render
    //get user complete questionaire data in order to attach to return result
    res.status(200).render('user-profile',{userData:userData});

	})
	.catch(function(error){
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          errorMessage = "Erro de autenticação na API";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 503:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(503).json({success:false, errorMessage:errorMessage, status: status, error:error});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }
  });

}

UsersDAO.prototype.getUserProfileSettingsPage = function(req, res){

	const axios = require('axios');
  const API_ADDRESS = process.env.ENV_API_ADDRESS;
  const userId = req.session.userId;
  var moment = require('moment');
  let userData;

	axios({
		method: 'GET',
    url: API_ADDRESS + '/GET_USER_DATA/' + userId
  })
	.then(function({data}){

		userData = data.userData;
		//user data aquired with success

    //render user-profile-settings page sending user data toghether to render
    //get user complete questionaire data in order to attach to return result
    res.status(200).render('user-profile-settings',{moment:moment,userData:userData,avatar_field: process.env.AVATAR_FIELD});

	})
	.catch(function(error){
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          errorMessage = "Erro de autenticação na API";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 503:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(503).json({success:false, errorMessage:errorMessage, status: status, error:error});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }
  });


}

UsersDAO.prototype.sendInstructionsToChangePassword = function(formData, req, res){

  const crypto = require('crypto');
	const axios = require('axios');
  const API_ADDRESS = process.env.ENV_API_ADDRESS;
  //secret to contact API and get user information
  const secret = 'PagrashaDiWahn';
  const hash = crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');

  const userEmail = formData.email;
  //check if user exists
  axios({
		method: 'POST',
		url: API_ADDRESS + '/GET_USER_INFORMATION_BY_EMAIL/' + userEmail,
    data: {key:hash}
	})
	.then(function({data}){

		var userData = data.userData;
    var message = data.message;
		//user information retreived with success
		if(userData!=undefined){

      var nodemailer = require('nodemailer');

      const transporter = nodemailer.createTransport({
        host: "mail.zeneconomics.com.br",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        	user: "no-reply-cdv@zeneconomics.com.br",
        	pass: "Kobaias1?"
        },
        tls: { rejectUnauthorized: false }
      });

      let fs = require('fs');
      htmlMarkup = fs.readFileSync('app/views/mailTemplates/password.html','utf-8');

      //change mustaches in htmlMarkup;
      const userName = userData.name;
      const passwordChangeKey = userData.updatePasswordInformation.changeKey;
      const link = req.protocol + '://' + req.get('host') + '/checkChangePasswordKey/' + passwordChangeKey;

      htmlMarkup = htmlMarkup.replace('{{userName}}',userName);
      htmlMarkup = htmlMarkup.replace('{{link-change-password}}',link);

      const sender = "no-reply-cdv@zeneconomics.com.br";

      const mailOptions = {
        from: 'ZenEconomics - Controle da Vida<'+sender+'>',
        to: userEmail,
        subject: 'Troca de senha solicitada na aplicação',
        text: 'Parece que você esqueceu a sua senha! Não se preocupe, isso acontece. Clique neste link para reinicializá-la:',
        html: htmlMarkup
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json({success:false,errorMessage:"Problemas ao enviar o e-mail. Erro reportado:" + error, errors:error});
        } else {
          data.success = true;
          data.message += ' Email enviado! Você tem até 15 minutos para realizar o procedimento. Verifique na sua caixa postal um e-mail enviado por ' + sender;
          res.status(200).json(data);
          return;
        }
      });

		} else {

      res.status(404).json({success:false, errorMessage:'Informações do usuário vieram vazias.'})
      return;

    }

	})
	.catch(function(error){

    const data = error.response.data;
    const status = error.response.status;
		res.status(status).json({success:false, errorMessage:data.errorMessage, status: status});

	});

}

UsersDAO.prototype.uploadUserAvatar = function(req, res){

  const crypto = require('crypto');
  const axios = require('axios');
  const userId = req.session.userId;

  const API_ADDRESS = process.env.ENV_API_ADDRESS + '/WRITE_USER_AVATAR_PATH';
  //secret to contact API and get user information
  const secret = 'PagrashaDiWahn';
  const hash = crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');

  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let uploadedFile = req.files.file;
  const fileName = "avatar_"+userId+".jpg";
  const filePath = process.env.PWD + "/app/assets" + process.env.AVATAR_BASE_URL + "/avatar_"+userId+".jpg";

  // Use the mv() method to place the file somewhere on your server
  uploadedFile.mv(filePath, function(err) {
    if (err){
      return res.status(500).json({"success":false,"errorMessage":"Método de renomear e mover o arquivo não foi bem sucedido","error":err});
    }
    //write avatar file path to database
    axios({
      method: 'POST',
      url: API_ADDRESS,
      data: {userId:userId,fileName:fileName, authenticationToken: hash}
    })
    .then(function({data}){

      var userData = data.userData;
      var message = data.message;
      var success = data.success;

      res.status(200).json({success:success, message:message, userData:userData});

    })
    .catch(function(error){
      const status = error.response.status;
      const success = error.response.data.success;
      const errorMessage = error.response.data.errorMessage;
      res.status(status).json({success:success, errorMessage:errorMessage});
    });
  });


}

UsersDAO.prototype.signup = function(user, req, res){

	const axios = require('axios');

	const API_ADDRESS = this._api_address + '/SIGNUP';

	axios({
		method: 'POST',
		url: API_ADDRESS,
		data: user
	})
	.then(function({data}){

    var userData = data.userData;
    var message = data.message;

		//user information retreived with success
		if(userData!=undefined && userData != {}){

      var nodemailer = require('nodemailer');

      const transporter = nodemailer.createTransport({
        host: "mail.zeneconomics.com.br",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        	user: "no-reply-cdv@zeneconomics.com.br",
        	pass: "Kobaias1?"
        },
        tls: { rejectUnauthorized: false }
      });

      let fs = require('fs');
      htmlMarkup = fs.readFileSync('app/views/mailTemplates/signupConfirmation.html','utf-8');

      //change mustaches in htmlMarkup;
      const userName = userData.name;
      const userEmail = userData.email;
      const signupConfirmationToken = userData.signup.authenticationToken;
      const confirmationLink = req.protocol + '://' + req.get('host') + '/confirmSignup/' + signupConfirmationToken;
      const removeLink = req.protocol + '://' + req.get('host') + '/removeUnauthorizedSignup/' + signupConfirmationToken;

      htmlMarkup = htmlMarkup.replace('{{user-name}}',userName);
      htmlMarkup = htmlMarkup.replace('{{link-confirm-signup}}',confirmationLink);
      htmlMarkup = htmlMarkup.replace('{{link-remove-unauthorize-user}}',removeLink);

      const sender = "no-reply-cdv@zeneconomics.com.br";

      const mailOptions = {
        from: 'ZenEconomics - Controle da Vida<'+sender+'>',
        to: userEmail,
        subject: 'Confirmação de Cadastro - Ferramenta da Vida - ZenEconomics',
        text: 'Você se cadastrou na Ferramenta da Vida da Zen Economics. Copie este link a seguir e cole no seu navegador para confirmar o seu cadastro:' + confirmationLink + ' . Caso não tenha efetuado o pedido, por favor, use este link a seguir para remover o usuário com o seu e-mail:' + removeLink,
        html: htmlMarkup
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json({success:false,errorMessage:"Problemas ao enviar o e-mail. Erro reportado:" + error, errors:error});
        } else {
          data.success = true;
          data.message += ' Email enviado! Você precisa confirmar o seu cadastro pelo link recebido para poder usar a sua conta. Verifique na sua caixa postal um e-mail enviado por ' + sender;
          res.status(200).json(data);
          return;
        }
      });
    } else {
      res.status(404).json({success:false, errorMessage:"Os dados de usuário foram cadastrados, mas não houve retorno de dados do usuário"});
    }
  })
	.catch(function(error){
    const status = error.response.status;
    const success = error.response.data.success;
    const errorMessage = error.response.data.errorMessage;
		res.status(status).json({success:success, errorMessage:errorMessage});
	});

}

UsersDAO.prototype.confirmSignup = function(authenticationToken, req, res){

	const axios = require('axios');

	const API_ADDRESS = this._api_address + '/CONFIRM_SIGNUP';

	axios({
		method: 'POST',
		url: API_ADDRESS,
		data: {authenticationToken:authenticationToken}
	})
	.then(function({data}){

    var userData = data.userData;
    var message = data.message;

		//user information retreived with success
		if(userData!=undefined && userData != {}){

      var nodemailer = require('nodemailer');

      const transporter = nodemailer.createTransport({
        host: "mail.zeneconomics.com.br",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        	user: "no-reply-cdv@zeneconomics.com.br",
        	pass: "Kobaias1?"
        },
        tls: { rejectUnauthorized: false }
      });

      let fs = require('fs');
      htmlMarkup = fs.readFileSync('app/views/mailTemplates/signupAuthenticationConfirmation.html','utf-8');

      //change mustaches in htmlMarkup;
      const userName = userData.name;
      const userEmail = userData.email;
      const signupConfirmationToken = userData.signup.authenticationToken;
      const removeLink = req.protocol + '://' + req.get('host') + '/removeUnauthorizedSignup/' + signupConfirmationToken;
      const zenLink = req.protocol + '://' + req.get('host');

      htmlMarkup = htmlMarkup.replace('{{user-name}}',userName);
      htmlMarkup = htmlMarkup.replace('{{link-remove-unauthorize-user}}',removeLink);
      htmlMarkup = htmlMarkup.replace('{{link-zen-login}}',zenLink);

      const sender = "no-reply-cdv@zeneconomics.com.br";

      const mailOptions = {
        from: 'ZenEconomics - Controle da Vida<'+sender+'>',
        to: userEmail,
        subject: 'Confirmação de Cadastro - Ferramenta da Vida - ZenEconomics',
        text: 'Você confirmou o seu cadastro na Ferramenta da Vida da Zen Economics. Copie este link a seguir e cole no seu navegador para entrar na ferramenta:' + zenLink + ' . Caso não tenha efetuado o pedido, por favor, use este link a seguir para remover o usuário com o seu e-mail:' + removeLink,
        html: htmlMarkup
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json({success:false,errorMessage:"Problemas ao enviar o e-mail. Erro reportado:" + error, errors:error});
        } else {
          data.success = true;
          data.message += 'O seu cadastro foi confirmado e você recebeu um email de confirmação. Você pode logar na ferramenta';
          res.status(200).render("index",{target:"home",validation:{},message:[{msg:userName+",seu cadastro foi confirmado com sucesso! Você pode logar na ferramenta agora!"}]});
          return;
        }
      });
    } else {
      res.status(404).json({success:false, errorMessage:"Não foi possível confirmar o seu cadastro com o token fornecido!"});
    }
  })
	.catch(function(error){
    const status = error.response.status;
    const errorMessage = error.response.data.errorMessage;
    const success = error.response.data.success;
		res.status(status).json({success:success, errorMessage:errorMessage, error: error});
	});

}

UsersDAO.prototype.removeUnauthorizedSignup = function(authenticationToken, req, res){

	const axios = require('axios');

	const API_ADDRESS = this._api_address + '/REMOVE_UNAUTHORIZED_SIGNUP';

	axios({
		method: 'DELETE',
		url: API_ADDRESS,
		data: {authenticationToken:authenticationToken}
	})
	.then(function({data}){

    var success = data.success;
    var userData = data.user;
    var message = data.message;



		//user information removed with success
		if(success){


      var nodemailer = require('nodemailer');

      const transporter = nodemailer.createTransport({
        host: "mail.zeneconomics.com.br",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        	user: "no-reply-cdv@zeneconomics.com.br",
        	pass: "Kobaias1?"
        },
        tls: { rejectUnauthorized: false }
      });

      let fs = require('fs');
      htmlMarkup = fs.readFileSync('app/views/mailTemplates/removeUnauthorizedSignupConfirmation.html','utf-8');

      //change mustaches in htmlMarkup;
      const userName = userData.name;
      const userEmail = userData.email;
      const signupConfirmationToken = userData.signup.authenticationToken;

      htmlMarkup = htmlMarkup.replace('{{user-name}}',userName);

      const sender = "no-reply-cdv@zeneconomics.com.br";

      const mailOptions = {
        from: 'ZenEconomics - Controle da Vida<'+sender+'>',
        to: userEmail,
        subject: 'Confirmação de Remoção de Cadastro - Ferramenta da Vida - ZenEconomics',
        text: 'Alguém cadastrou seu e-mail na Ferramenta da Vida da Zen Economics e você solicitou a remoção deste cadastro através de um link enviado para este endereço de e-mail. ',
        html: htmlMarkup
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json({success:false,errorMessage:"Problemas ao enviar o e-mail de confirmação de exclusão de cadastro não solicitado. Erro reportado:" + error, errors:error});
        } else {
          data.success = true;
          data.message += 'O cadastro feito com o seu endereço de e-mail foi removido. Verifique na sua caixa postal um e-mail enviado por ' + sender;
          res.status(200).render("unsignedup",{target:"index",validation:{},message:[{msg:userName+",o cadastro realizado com o seu nome e/ou seu e-mail (" + userEmail + ") foi removido com sucesso!"}]});
          return;
        }
      });
    } else {
      res.status(404).render("unsignedup",{target:"index",validation:[{msg:"Os dados de usuário foram removidos, mas não houve retorno de dados da aplicação"}],message:{}});
    }
  })
	.catch(function(error){
    const status = error.response.status;
    const errorMessage = error.response.data.errorMessage;
		res.status(status).render("unsignedup",{target:"index",validation:[{msg:errorMessage}],message:{}});
	});

}

UsersDAO.prototype.changePassword = function(formData, req, res){

	const axios = require('axios');

	const API_ADDRESS = this._api_address + '/CHANGE_PASSWORD';

	axios({
		method: 'POST',
		url: API_ADDRESS,
		data: formData
	})
	.then(function({data}){
		res.json(data);
	})
	.catch(function(error){
		res.json({success:false, errorMessage:'erro no processo de autenticação', error: error});
	});

}

UsersDAO.prototype.checkChangePasswordKey = function(changePasswordKey, req, res){

	const axios = require('axios');

	const API_ADDRESS = this._api_address + '/CHECK_CHANGE_PASSWORD_KEY';

	axios({
		method: 'GET',
		url: API_ADDRESS + '/' + changePasswordKey,
	})
	.then(function({data}){
    const success = data.success;
    const userData = data.userData[0];
    const changeKey = userData.updatePasswordInformation.changeKey;

		res.status(200).render("changePassword",{success:data.success, message: data.message, securityCode:changeKey});
	})
	.catch(function(error){
    const response = error.response;
    const status = response.status;
    const data = response.data;

		res.status(status).render("changePassword",{success:data.success, errorMessage: data.errorMessage, securityCode:""});
    //res.status(status).json({success:data.success, errorMessage: data.errorMessage});
	});

}

UsersDAO.prototype.updateUserProfileData = function(formData, req, res){

  const axios = require('axios');
  const crypto = require('crypto');

  const API_ADDRESS = this._api_address + '/UPDATE_USER_PROFILE_DATA';

  const secret = 'PagrashaDiWahn';
  const hash = crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');

  formData.key = hash;

  const userId = req.session.userId;

  formData.userId = userId;

	axios({
		method: 'PUT',
		url: API_ADDRESS,
		data: formData
	})
	.then(function({data}){

    let userData = data.userData;
    let message = data.message;
    let success = data.success;

		//user information retreived with success
		if(userData!=undefined && userData != {}){
      res.status(201).json({success:true,message:'Atualização efetuada com sucesso',userData:userData});
    } else {
      res.status(404).json({success:false, errorMessage:"Os dados de usuário foram alterados, mas não houve retorno de dados da base"});
    }
  })
	.catch(function(error){
    const status = error.response.status;
    const success = error.response.data.success;
    const errorMessage = error.response.data.errorMessage;
		res.status(status).json({success:success, errorMessage:errorMessage});
	});

}

UsersDAO.prototype.getSimulatorPage = async function(req, res){

  const axios = require('axios');
  const crypto = require('crypto');
  var moment = require('moment');
  const userId = req.session.userId;
  let response = {};

  const API_ADDRESS_1 = this._api_address + '/GET_USER_DATA/' + userId;
  const API_ADDRESS_2 = this._api_address + '/GET_RESOURCES_LAYOUT_DATA';

  const secret = 'PagrashaDiWahn';
  const hash = crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');

	let call1 = axios({
		method: 'GET',
    url: API_ADDRESS_1
  })
	.then(function({data}){

		userData = data.userData;
    //user data aquired with success

    console.log("user data aquired with success. follow data: ");
    console.log(userData);

    //render user-profile-settings page sending user data toghether to render
    //get user complete questionaire data in order to attach to return result
    //res.status(200).render('tools/simulator',{moment:moment,userData:userData});
    response.userData = userData;

  })
	.catch(function(error){
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          errorMessage = "Erro de autenticação na API";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 503:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(503).json({success:false, errorMessage:errorMessage, status: status, error:error});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }
  });

  let call2 = axios({
		method: 'GET',
    url: API_ADDRESS_2
  })
	.then(function({data}){

		resourceData = data.resourcesLayoutData;
    //user data aquired with success

    console.log("resource data aquired with success. follow data: ");
    console.log(resourceData);

    //render user-profile-settings page sending user data toghether to render
    //get user complete questionaire data in order to attach to return result
    //res.status(200).render('tools/simulator',{moment:moment,userData:userData});
    response.resourceData = resourceData;

	})
	.catch(function(error){
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          errorMessage = "Erro de autenticação na API";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 503:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(503).json({success:false, errorMessage:errorMessage, status: status, error:error});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }
  });

  console.log("calling call 1 on getSimulatorPage");
  await call1;
  console.log("calling call 2 on getSimulatorPage");
  await call2;
  console.log("no error. returning rendering simulator");
  console.log("response=====>>>>>>>>>>>>>>>>>>>");
  console.log(response);
  res.status(200).render('tools/simulator',{moment:moment,data:response});

}

UsersDAO.prototype.getProjectionPage = async function(req, res){

  const axios = require('axios');
  const crypto = require('crypto');
  var moment = require('moment');
  const userId = req.session.userId;
  let response = {};

  const API_ADDRESS_1 = this._api_address + '/GET_USER_DATA/' + userId;
  const API_ADDRESS_2 = this._api_address + '/GET_RESOURCES_LAYOUT_DATA';
  const API_ADDRESS_3 = this._api_address + '/GET_PROJECTION_PARAMETERS';

  const secret = 'PagrashaDiWahn';
  const hash = crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');

	let call1 = axios({
		method: 'GET',
    url: API_ADDRESS_1
  })
	.then(function({data}){

		userData = data.userData;
    //user data aquired with success

    console.log("user data aquired with success. follow data: ");
    console.log(userData);

    //render user-profile-settings page sending user data toghether to render
    //get user complete questionaire data in order to attach to return result
    //res.status(200).render('tools/simulator',{moment:moment,userData:userData});
    response.userData = userData;

  })
	.catch(function(error){
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          errorMessage = "Erro de autenticação na API";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 503:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(503).json({success:false, errorMessage:errorMessage, status: status, error:error});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }
  });

  let call2 = axios({
		method: 'GET',
    url: API_ADDRESS_2
  })
	.then(function({data}){

		resourceData = data.resourcesLayoutData;
    //user data aquired with success

    console.log("resource data aquired with success. follow data: ");
    console.log(resourceData);

    //render user-profile-settings page sending user data toghether to render
    //get user complete questionaire data in order to attach to return result
    //res.status(200).render('tools/simulator',{moment:moment,userData:userData});
    response.resourceData = resourceData;

	})
	.catch(function(error){
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          errorMessage = "Erro de autenticação na API";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 503:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(503).json({success:false, errorMessage:errorMessage, status: status, error:error});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }
  });

  let call3 = axios({
		method: 'GET',
    url: API_ADDRESS_3
  })
	.then(function({data}){

		projectionData = data.projectionParameterData;
    //projection parameters data aquired with success

    console.log("projection parameters data aquired with success. follow data: ");
    console.log(projectionData);

    //render user-profile-settings page sending user data toghether to render
    //get user complete questionaire data in order to attach to return result
    //res.status(200).render('tools/simulator',{moment:moment,userData:userData});
    response.projectionData = projectionData;

	})
	.catch(function(error){
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          errorMessage = "Erro de autenticação na API";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 503:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(503).json({success:false, errorMessage:errorMessage, status: status, error:error});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }
  });

  console.log("calling call 1 on getSimulatorPage");
  await call1;
  console.log("calling call 2 on getSimulatorPage");
  await call2;
  console.log("calling call 3 on getSimulatorPage");
  await call3;
  console.log("no error. returning rendering simulator");
  console.log("response=====>>>>>>>>>>>>>>>>>>>");
  console.log(response);
  res.status(200).render('tools/projection',{moment:moment,data:response});

}

UsersDAO.prototype.getHomePage = async function(req, res){

  const axios = require('axios');
  const crypto = require('crypto');
  var moment = require('moment');
  const userId = req.session.userId;
  let response = {};

  const API_ADDRESS_1 = this._api_address + '/GET_USER_DATA/' + userId;
  const API_ADDRESS_2 = this._api_address + '/GET_RESOURCES_LAYOUT_DATA';
  const API_ADDRESS_3 = this._api_address + '/GET_PROJECTION_PARAMETERS';

  const secret = 'PagrashaDiWahn';
  const hash = crypto
                .createHmac('sha512',secret)
                .update('I hate cupcakes')
                .digest('hex');

	let call1 = axios({
		method: 'GET',
    url: API_ADDRESS_1
  })
	.then(function({data}){

		userData = data.userData;
    //user data aquired with success

    console.log("user data aquired with success. follow data: ");
    console.log(userData);

    //render user-profile-settings page sending user data toghether to render
    //get user complete questionaire data in order to attach to return result
    //res.status(200).render('tools/simulator',{moment:moment,userData:userData});
    response.userData = userData;

  })
	.catch(function(error){
      console.log(error);
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          errorMessage = "Erro de autenticação na API";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 503:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(503).json({success:false, errorMessage:errorMessage, status: status, error:error});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }
  });

  let call2 = axios({
		method: 'GET',
    url: API_ADDRESS_2
  })
	.then(function({data}){

		resourceData = data.resourcesLayoutData;
    //user data aquired with success

    console.log("resource data aquired with success. follow data: ");
    console.log(resourceData);

    //render user-profile-settings page sending user data toghether to render
    //get user complete questionaire data in order to attach to return result
    //res.status(200).render('tools/simulator',{moment:moment,userData:userData});
    response.resourceData = resourceData;

	})
	.catch(function(error){
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          errorMessage = "Erro de autenticação na API";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 503:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(503).json({success:false, errorMessage:errorMessage, status: status, error:error});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }
  });

  let call3 = axios({
		method: 'GET',
    url: API_ADDRESS_3
  })
	.then(function({data}){

		projectionData = data.projectionParameterData;
    //projection parameters data aquired with success

    console.log("projection parameters data aquired with success. follow data: ");
    console.log(projectionData);

    //render user-profile-settings page sending user data toghether to render
    //get user complete questionaire data in order to attach to return result
    //res.status(200).render('tools/simulator',{moment:moment,userData:userData});
    response.projectionData = projectionData;

	})
	.catch(function(error){
      const status = error.response.status;
      let errorMessage = "";
      switch(status){
        case 401:
          errorMessage = "Erro de autenticação na API";
          res.json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 404:
          errorMessage = "Usuário não encontrado no cadastro. ";
          res.status(404).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 502:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(502).json({success:false, errorMessage:errorMessage, status: status});
        break;
        case 503:
          errorMessage = "Problemas no servidor da API, que não está enviando mensagens de retorno. ";
          res.status(503).json({success:false, errorMessage:errorMessage, status: status, error:error});
        break;
        default:
          res.status(500).json({success:false, errorMessage:error.response.data.errorMessage, status: error.response.status});
        break;
      }
  });

  console.log("calling call 1 on getSimulatorPage");
  await call1;
  console.log("calling call 2 on getSimulatorPage");
  await call2;
  console.log("calling call 3 on getSimulatorPage");
  await call3;
  console.log("no error. returning rendering simulator");
  console.log("response=====>>>>>>>>>>>>>>>>>>>");
  console.log(response);
  res.status(200).render('dashboard',{moment:moment,data:response});

}

UsersDAO.prototype.delete = function(user){}

UsersDAO.prototype.update = function(user, req, res){}

UsersDAO.prototype.getAll = function(req, res){}

UsersDAO.prototype.getOne = function(req, res){}

module.exports = function(){
    return UsersDAO;
}
