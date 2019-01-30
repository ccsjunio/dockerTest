"use strict";

$(document).ready(function(){

    // Change this to the location of your server-side upload handler:
    const url = '/upload_user_avatar';

    document.querySelector("#fileupload-avatar").addEventListener('change', function(){
      const file = this.files[0];

      //allowed types
      const mime_types = ['image/jpeg', 'image/png'];

      //validate mime type
      if(mime_types.indexOf(file.type) == -1){
        alert('bad guy! this file type is invalid!');
        return;
      }

      //Max 2Mb allowed
      if(file.size > 2*1024*1024){
        alert('what are you trying to upload? Instagram?');
        return;
      }

      //validation successfull
      //this is the name of the file
      alert('you have chosen the file ' + file.name);

      //file selected by the user
      //in case of multiple files append each of them
      let formData = new FormData();
      formData.append('file', document.querySelector('#fileupload-avatar').files[0]);

      //AJAX post
      $.ajax({
        url: url,
        data: formData,
        type: "POST",
        contentType: false,
        processData: false,
        dataType: "json",
        error: function(jqXHR, errorStr, exception){
          console.log("error on post of picture");
          console.log("error: "+ errorStr);
          console.log("jqXHR");
          console.log(jqXHR);
        },
        statusCode:{
          404: function(){
            alert("page not found");
          },
          401: function(){
            alert("not allowed");
          }
        },
        success: function(data, statusStr, jqXHR){
          if(data.success){
            let userData = data.userData;
            let avatar_file = userData.avatar;
            let newTime = new Date();
            $(".avatar_path_image").attr("src","images/uploads/avatars/"+avatar_file+"?random="+newTime);
          } else {
            console.log("upload not successfull. errorMessage: " + data.errorMessage);
          }
        }

      });


    });
  /*end of bind to avatar change command*/

  /* update user profile data*/
  $("#user-profile-settings-form").on("submit",function(e){
    e.preventDefault();
    let formData = $("#user-profile-settings-form").serialize();

    let formSendRequest = $.ajax({
      url:'/update_user_profile_data',
      method:'POST',
      dataType: 'json',
      data:formData,
      error:function(jqXHR, textStatus, err){
        var status = jqXHR.status;
        console.log("status:" + status);
        console.log("jqXHR:");
        console.log(jqXHR);
        var errorMessage = "erro na submissão de dados de atualização do perfil do usuário";
        switch(status){
          case 401:
          $("#user-profile-settings-form").append(
            '<div class="alert alert-danger" id="signInError">' +
              '<strong>Atenção! <br/> '+
                errorMessage +
              '</strong>' +
            '</div>'
          );
          $("#signInError").delay(2000).fadeOut('slow', function(){$(this).remove()});
          break;
          default:
            $("#user-profile-settings-form").append(
              '<div class="alert alert-danger" id="signInError">' +
                '<strong>Atenção! <br/> '+
                  'Problemas no processo de cadastro: erro informado:'+err + ' status informado:' + status + 
                '</strong>' +
              '</div>'
            );
            $("#signInError").delay(2000).fadeOut('slow', function(){$(this).remove()});
          break;
        }

      }
    });

    formSendRequest.done(function(data){

      console.log('done');
      console.log(data);

      if(data.success){
        alert("data updated successfully!");
      } else {
        $("#user-profile-settings-form").append(
          '<div class="alert alert-danger" id="signInError">' +
            '<strong>Atenção! <br/> '+
              'Não foi possível efetuar o cadastro. Por favor tente novamente. Um e-mail foi enviado para o suporte informando sobre o ocorrido para que sejam verificados eventuais problemas.'+
            '</strong>' +
          '</div>'
        );
        $("#signInError").delay(2000).fadeOut('slow', function(){$(this).remove()});

      }
    });


  });

  /*end of update user profile data*/

});