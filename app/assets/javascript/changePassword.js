$(document).ready(function(){

  var formErrors = false;

  $('#btnChangePassword').on("click",function(event){
    event.preventDefault();
    var formData = $(".form-changePassword").serialize();
    var changePasswordRequest = $.ajax({

      url:'/changePassword',
      method:'POST',
      dataType: 'json',
      data:formData

    });

    changePasswordRequest.done(function(data){

      console.log('done');
      console.log(data);

      if(data.success){
        /*TODO:procedures to send email to user and redirect to hom*/
        window.location ='/passwordChanged';
      } else {
        $(".form-changePassword").append(
          '<div class="alert alert-danger" id="changePasswordError">' +
            '<strong>Atenção! <br/> '+
              'Não foi possível alterar a sua senha.'+
            '</strong>' +
          '</div>'
        );
        $("#changePasswordError").delay(2000).fadeOut('slow', function(){$(this).remove()});

      }
    });

  });

  $("#btnBackHome").on("click",function(event){
    event.preventDefault();
    window.location ='/';
  });

   $("#inputPassword").on("change keypress keyup blur",function(event){
    var password = $(this).val().trim();
    var passwordConfirmation = $("#inputPasswordConfirmation").val().trim();
    if(password != passwordConfirmation){

      formErrors = true;

      if($("#changePasswordError").length ===0){
        $(".form-changePassword").append(
          '<div class="alert alert-danger" id="changePasswordError">' +
            '<strong>Atenção! As senhas não coincidem'+
            '</strong>' +
          '</div>'
        );
      }//if($("#changePasswordError").length ===0)

    } else {

      if($("#changePasswordError").length !==0){
        $("#changePasswordError").remove();
      }

      formErrors = false;

    }

  });// $("#inputPassword").on("change keypress",function(event)

   $("#inputPasswordConfirmation").on("change keypress keyup blur",function(event){
    var passwordConfirmation = $(this).val().trim();
    var password = $("#inputPassword").val().trim();
    if(password != passwordConfirmation){

      formErrors = true;

      if($("#changePasswordError").length ===0){
        $(".form-changePassword").append(
          '<div class="alert alert-danger" id="changePasswordError">' +
            '<strong>Atenção! As senhas não coincidem'+
            '</strong>' +
          '</div>'
        );
      }//if($("#changePasswordError").length ===0)

    } else {

      if($("#changePasswordError").length !==0){
        $("#changePasswordError").remove();
      }

      formErrors = false;

    }

  });// $("#inputPassword").on("change keypress",function(event)

});
