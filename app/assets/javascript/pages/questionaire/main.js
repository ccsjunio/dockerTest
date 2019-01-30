$('document').ready(function(){

  //bind explode subresource container icon
  $(".toggle_subresource_container").on("click",function(event){
    event.preventDefault();
    event.stopPropagation();
    let collapsed = $(this).attr("collapsed");
    let resource = $(this).attr("resource");
    let subResource = $(this).attr("subResource");
    if(collapsed=="true"){
      $(this).attr("collapsed","false");
      $(".subResourceContainer[resource='"+resource+"'][subresource='"+subResource+"']").fadeIn();
      $(this).find("span").removeClass("fa-plus-square").addClass("fa-minus-square");
    } else {
      $(this).attr("collapsed","true");
      $(".subResourceContainer[resource='"+resource+"'][subresource='"+subResource+"']").fadeOut();
      $(this).find("span").removeClass("fa-minus-square").addClass("fa-plus-square");
    }
  });//$(".toggle_subresource_container").on("click",function(event)

  //bind remove this action button to new input created
  $("fieldset[resource][subresource][topic]").on("click","button[resource][subresource][topic][action='remove_action']",function(event){

    event.preventDefault();
    event.stopPropagation();

    const resource = $(this).attr("resource");
    const subResource = $(this).attr("subresource");
    const topic = $(this).attr("topic");
    const order = $(this).attr("order");
    const originalValue = $(this).attr("originalValue");
    const inputElement = $("input[order='"+order+"'][resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"']");

    inputElement.parent().parent().parent().remove();

    //reenable option on select range
    $("select[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"'] option[value='"+originalValue+"']").prop("disabled", false);

    if(updateDataToServer(resource,subResource)===true){
      console.log("updated successfully 1");
        $("h3[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"']").after('<span class="badge badge-subtle badge-success">resposta gravada com sucesso!</span>')
    }

  });

  $("input[order][resource][subresource][topic='questionaire']").on("change keyup",function(event){
    console.log("changed input in questionaire");
    event.preventDefault();
    event.stopPropagation();
    let order = $(this).attr("order");
    let resource = $(this).attr("resource");
    let subResource = $(this).attr("subResource");
    let topic = $(this).attr("topic");
    let type = $(this).attr("type") == "range" ? "number" : "range";
    console.log("type="+type);
    $("input[type='"+type+"'][order='"+order+"'][resource='"+resource+"'][subresource='"+subResource+"'][topic='questionaire']").val($(this).val());
    //update database
    updateDataToServer(resource,subResource);
  });

  $("input[order][resource][subresource][topic='free_questionaire']").on("change",function(event){
    console.log("changed input in free_questionaire");
    event.preventDefault();
    event.stopPropagation();
    let resource = $(this).attr("resource");
    let subResource = $(this).attr("subResource");
    //update database
    updateDataToServer(resource,subResource);
  });

  //bind action to change state from action select
  $("select.custom-select[resource][subresource][topic]").on("change",function(event){
    event.preventDefault();
    event.stopPropagation();
    const resource = $(this).attr("resource");
    const subResource = $(this).attr("subresource");
    const topic = $(this).attr("topic");
    const input = $("input[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"'][order='0'][temporary='true']");
    input.val($(this).val());
    input.attr("originalValue",$(this).val());
  });

  //bind click event to add action button
  $("button[resource][subresource][topic][action='add_action']").on("click",async function(event){

    event.preventDefault();
    event.stopPropagation();

    const resource = $(this).attr("resource");
    const subResource = $(this).attr("subresource");
    const topic = $(this).attr("topic");
    let order = $(this).attr("order");

    let input = $("input[order='"+order+"'][resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"'][temporary='true']");
    const thisValue = input.val().trim();
    const originalValue = input.attr("originalValue");

    console.log("the value when button to add was clicked:" + thisValue);

    if(thisValue==""){
      console.log("the value is empty - show warning");
      let alertMarkup = '<div class="alert alert-warning" role="alert" id="alertOfMissingActionMarkup" style="display:none;">' +
                          'Não é possível acrescentar uma ação vazia. Por favor insira o texto de uma ação e prossiga.' +
                        '</div>';
      let button = $("button[order='0'][resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"']");
      button.parent().parent().parent().after(alertMarkup);
      $("#alertOfMissingActionMarkup").show().delay(1000).fadeOut(1000,function(){
        $("#alertOfMissingActionMarkup").remove();
      });
      return;
    }

    //set a random order number for the new input, different from those already existed
    let random = Math.floor(Math.random()*1000+1);
    while(order===random){
      random = Math.floor(Math.random()*1000+1);
      let inputs = $("input[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"'][temporary='false']");
      inputs.each(function(){
        if(+$(this).attr("order")==random){
          order = random;
        }
      });
    }
    order = random;

    //build new input line markup
    let newInput = '';
    newInput += '<div class="row">';
    newInput +=   '<div class="form-group col-sm-12">';
    newInput +=     '<div class="input-group input-group-alt">';
    newInput +=       '<input type="text" value="'+thisValue+'" originalValue="'+thisValue+'" class="form-control" resource="'+resource+'" subresource="'+subResource+'" topic="'+topic+'" order="'+order+'" disabled aria-describedby="button-addon-'+order+'" temporary="false">';
    newInput +=       '<div class="input-group-append">';
    newInput +=         '<button type="button" class="btn btn-danger" id="button-addon-'+order+'" order="'+order+'" resource="'+resource+'" subresource="'+subResource+'" originalValue="'+originalValue+'" topic="'+topic+'" action="remove_action">Remover esta ação</button>';
    newInput +=       '</div>';
    newInput +=     '</div>';
    newInput +=   '</div>';
    newInput += '</div>';

    $(".actionsContainer[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"']").prepend(newInput);

    //erase value from temporary input
    $("input[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"'][order='0'][temporary='true']").val('');

    //disable option on select range
    $("select[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"'] option[value='"+originalValue+"']").prop("disabled", true);

    if(await updateDataToServer(resource,subResource)===true){
      console.log("updated successfully 2");
        $("h3[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"']").after('<span class="badge badge-subtle badge-success">resposta gravada com sucesso!</span>');
    }

  });

});//$('document').ready(function()

function updateDataToServer(resource,subResource){
  //prepare data to be sent
  let data = {
    resources:{
      money:{
        "organização":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "dívidas":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "receita/plano b":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "investimento":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        }
      },
      health:{
        "gestão da saúde":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "alimentação":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "exercício físico":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "sono e respiração":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        }
      },
      knowledge:{
        "organização do aprendizado":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "tomada de decisão":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "heurística/sabedoria":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "carreira - plano b":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        }
      },
      time:{
        "organização do tempo":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "produtividade":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "presença":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "relatividade":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        }
      },
      emotion:{
        "organização das emoções":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "descoberta":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "relacionamento":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        },
        "egoísmo/altruísmo":{
          o_que_evitar:[],
          o_que_fazer:[],
          questionaire:[],
          free_questionaire:[]
        }
      }
    }
  };

  //iterate through fieldsets to access all input fields no temporary
  let fieldsets = $("fieldset[resource][subresource][topic]");
  fieldsets.each(function(){
    let resource = $(this).attr("resource");
    let subResource = $(this).attr("subresource");
    let topic = $(this).attr("topic");
    //collect inputs from this resource and subresource
    if(topic=='o_que_evitar'||topic=='o_que_fazer'){
      let inputs = $("input[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"'][temporary='false']");
      inputs.each(function(){
        let thisInputValue = $(this).val();
        let thisInputOrder = $(this).attr("order");
        let originalValue = $(this).attr("originalValue");
        data.resources[resource][subResource][topic].push({
          option:thisInputValue,
          order:thisInputOrder,
          originalValue:originalValue
        });
      });//inputs each function
    }
    if(topic=='questionaire'){
      let inputs = $("input[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"'][temporary='false']");
      inputs.each(function(){
        let thisInputValue = $(this).val();
        let thisInputOrder = $(this).attr("order");
        let thisQuestion = $(this).text();

        data.resources[resource][subResource][topic].push({
          score:thisInputValue,
          order:thisInputOrder,
          question:thisQuestion
        });
      });//inputs each function
    }
    if(topic=='free_questionaire'){
      let inputs = $("input[resource='"+resource+"'][subresource='"+subResource+"'][topic='"+topic+"'][temporary='false']:checked");
      inputs.each(function(){

        let thisInputValue = $(this).val();
        let thisInputQuestionOrder = $(this).attr("questionOrder");
        let thisInputQuestion = $(this).attr("question");
        let thisInputAnswerOrder = $(this).val();
        let thisInputAnswerText = $(this).attr("answerText");

        data.resources[resource][subResource][topic].push({
          question:thisInputQuestion,
          order:thisInputQuestionOrder,
          answerOrder:thisInputAnswerOrder,
          answerText:thisInputAnswerText
        });
      });//inputs each function
    }

  });

  //request update on user questionaire data:
  let requestQuestionaireUpdate = $.ajax({
    url:"/questionaire/" + resource.toLowerCase(),
    method:"PUT",
    data:JSON.stringify(data),
    contentType:"application/json",
    dataType:"json",
    error:function(jqXHR, textStatus, errorThrown){
      console.log("error thrown by ajax request to put data");
      let alertMarkup = '<div class="alert alert-warning" role="alert" id="alertOfMissingActionMarkup" style="display:none;">' +
                          'Não foi possível gravar esta atualização das suas respostas.' +
                        '</div>';
      let button = $("button[order='0'][resource='"+resource+"'][subresource='"+subResource+"'][topic='o_que_evitar']");
      button.parent().parent().parent().after(alertMarkup);
      $("#alertOfMissingActionMarkup").show().delay(1000).fadeOut(1000,function(){
        $("#alertOfMissingActionMarkup").remove();
      });
      return false;
    },
  });

  requestQuestionaireUpdate.done(async function(data){

    if(data.data.success){
      $(".savingMessage").html('<span class="badge badge-subtle badge-success">dados atualizados com sucesso!</span>');
      let message = $(".savingMessage");
      message.fadeIn(1000);
      message.fadeOut(1000);
    } else {
      $(".savingMessage").html('<span class="badge badge-subtle badge-danger">problemas ao atualizaros dados!</span>');
      let message = $(".savingMessage");
      message.fadeIn(1000);
      message.fadeOut(1000);
    }

  });
}
