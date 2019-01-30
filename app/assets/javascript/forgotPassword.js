$(document).ready(function(){

  let formErrors = false;

  $('.alert').alert();

  $('#btnSendInstructions').on("click",function(event){
    event.preventDefault();

    $("#btnSendInstructions").html("aguarde...");

    var formData = $(".form-sendInstructions").serialize();
    var sendInstructionsRequest = $.ajax({
      url:'/sendInstructions',
      method:'POST',
      dataType: 'json',
      data:formData,
      error:function(jqXHR,errorType,exception){
        $("#btnSendInstructions").html("Enviar instruções");
        var statusCode = jqXHR.status;
        console.log("jqXHR:");
        console.log(jqXHR);

        switch(statusCode){
          case 404:

            if($("#sendInstructionsRequestError").length!==0){
              $("#sendInstructionsRequestError").remove();
            }
            var errorMessageMarkup = '<div class="alert alert-danger alert-dismissible fade show" role="alert" id="sendInstructionsRequestError">' +
                                      '<strong>Atenção!</strong><br/>' +
                                        'Problemas no recurso para troca de senha. Consulte o administrador do sistema. Erro reportado: ' +
                                        '<span id="reportedError">'+responseText.errorMessage+'</span>' +
                                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                                          '<span aria-hidden="true">&times;</span>' +
                                        '</button>' +
                                        '</div>';
            $("#form-sendInstructions").append(errorMessageMarkup);

            $(".alert").alert();

          break;

          case 401:

            if($("#sendInstructionsRequestError").length!==0){
              $("#sendInstructionsRequestError").remove();
            }
            var errorMessageMarkup = '<div class="alert alert-danger alert-dismissible fade show" role="alert" id="sendInstructionsRequestError">' +
                                      '<strong>Atenção!</strong><br/>' +
                                        'Problemas de segurança. Consulte o administrador do sistema. Erro reportado: ' +
                                        '<span id="reportedError">'+responseText.errorMessage+'</span>' +
                                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                                          '<span aria-hidden="true">&times;</span>' +
                                        '</button>' +
                                        '</div>';
            $("#form-sendInstructions").append(errorMessageMarkup);

            $(".alert").alert();

          break;

          case 502:

            if($("#sendInstructionsRequestError").length!==0){
              $("#sendInstructionsRequestError").remove();
            }
            var errorMessageMarkup = '<div class="alert alert-danger alert-dismissible fade show" role="alert" id="sendInstructionsRequestError">' +
                                      '<strong>Atenção!</strong><br/>' +
                                        'Problemas de acesso ao servidor (502 - Proxy Error). Consulte o administrador do sistema. Erro reportado: ' +
                                        '<span id="reportedError"></span>' +
                                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                                          '<span aria-hidden="true">&times;</span>' +
                                        '</button>' +
                                        '</div>';
            $("#form-sendInstructions").append(errorMessageMarkup);

            $(".alert").alert();

          break;

        }//switch(statusCode)

        let responseText = "";

        try{
          responseText = JSON.parse(jqXHR.responseText);
        } catch(e){
          responseText = jqXHR.responseText;
        }


      }

    });//var sendInstructionsRequest = $.ajax

    sendInstructionsRequest.done(function(data){
      if(data.success){

        var message = data.message ? data.message : "Informações de alteração de senha configuradas com sucesso! Um e-mail foi enviado para a sua caixa postal com o remetente no-reply-cdv@zeneconomics.com.br";
        if($("#sendIntructionsMessage").length!==0){
          $("#sendIntructionsMessage").remove();
        }
        var messageMarkup = '<div class="alert alert-success alert-dismissible fade show" role="alert" id="sendIntructionsMessage">' +
                                  '<strong>Sucesso!</strong><br/>' +
                                    '<span id="reportedMessage">'+data.message+'</span>' +
                                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                                      '<span aria-hidden="true">&times;</span>' +
                                    '</button>' +
                                    '</div>';
        $("#form-sendInstructions").append(messageMarkup);

        $(".alert").alert();

        $("#btnSendInstructions").hide();
        $("#inputEmail").hide();
        $("h1").html('Volte para a tela de login ou verifique seu email.');

        /*TODO:continue with procedures to send email to user and redirect to home*/
        //window.location ='/';

      } else {
        var errorMessage = data.errorMessage ? data.errorMessage : "O campo de e-mail não pode estar vazio!";
        if($("#sendInstructionsRequestError").length!==0){
          $("#sendInstructionsRequestError").remove();
        }
        var errorMessageMarkup = '<div class="alert alert-warning alert-dismissible fade show" role="alert" id="sendInstructionsRequestError">' +
                                  '<strong>Atenção!</strong><br/>' +
                                    data.errorMessage +
                                    '<span id="reportedError"></span>' +
                                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
                                      '<span aria-hidden="true">&times;</span>' +
                                    '</button>' +
                                    '</div>';
        $("#form-sendInstructions").append(errorMessageMarkup);

        $(".alert").alert();
      }
    });//sendInstructionsRequest.done(function(data)

  });//$('#btnSendInstructions').on("click",function(event)

  $("#btnBackHome").on("click",function(event){
    event.preventDefault();
    window.location ='/';
  });

  $("#inputEmail").on("blur change keyup", function(event){

    let validation = new FormValidation();
    let email = $(this).val();

    if( validation.validateEmail( $(this).val() ) ) {
      $("#btnSendInstructions").attr("disabled",false);
    } else {
      $("#btnSendInstructions").attr("disabled",true);
    }

    validation = null;
    delete validation;

  });//$("#inputEmail").on("blur change keyup", function(event)


});//$(document).ready(function()
