export function updateEvolutionChart(chartContainer,resultsTableId=null){
    //get completed user questionaires information

    console.log("got into updateEvolutionChart");

    var response = {};

    var userResults = [];
    var resultsTable = [];
    var chartLables = [];
    var chartData = [];
    var resultsTableMarkupBase = "<table class='table table-striped table-sm' id='resultsTable'>"+
                                "<thead>" +
                                  "<tr>" +
                                    "<th>Data</th>" +
                                    "<th>Média</th>" +
                                    "<th>Dinheiro</th>" +
                                    "<th>Saúde</th>" +
                                    "<th>Conhecimento</th>" +
                                    "<th>Tempo</th>" +
                                    "<th>Emoção</th>" +
                                  "</tr>" +
                                "</thead>" +
                                "<tbody>" +
                                "</tbody>" +
                                "</table>";

    var completeQuestionairesRequest = $.ajax({
          url:'/get_complete_user_questionaires',
          method:'GET',
          dataType: 'json',
    });

    completeQuestionairesRequest.done(function(data){

      if(data.success){

        //prepare array with results
        var questionaires = data.userQuestionaires;

        for(var q=0;q<questionaires.length;q++){

          var questionaire = questionaires[q];
          var questionaireDate = questionaire.update ? questionaire.update : null;

          userResults[q]={questionaireDate:questionaireDate};

          var questionaireNewDate = new Date(questionaireDate);
          var questionaireNewDateString = questionaireNewDate.toLocaleString("pt-BR");;

          resultsTable[q]={};
          resultsTable[q].questionaireDate=questionaireNewDateString;


          chartLables[q]=questionaireNewDateString

          var resources = questionaires[q].resources;
          userResults[q].resources = {};

          var lifeTotals = 0;
          var lifeCount = 0;

          for(var r in resources){

            userResults[q].resources[r]={};
            var subresources = resources[r];

            userResults[q].resources[r].average = 0;
            userResults[q].resources[r].subresources = {};

            var resourceTotals = 0;
            var resourceCount = 0;

            for(var s in subresources){
              //calc average from subresource
              var questionaireTopic = subresources[s].questionaire ? subresources[s].questionaire : {};

              var questionaireTotal = 0;
              var questionaireCount = 0;

              for(var qindex=0;qindex<questionaireTopic.length;qindex++){
                questionaireTotal += +questionaireTopic[qindex].score;
                questionaireCount ++;
              }

              var free_questionaire = subresources[s].free_questionaire ? subresources[s].free_questionaire : {};

              var free_questionaireTotal = 0;
              var free_questionaireCount = 0;

              for(var qindex=0;qindex<free_questionaire.length;qindex++){
                free_questionaireTotal += (+free_questionaire[qindex].answerOrder)*2;
                free_questionaireCount ++;
              }

              var subResourceAverage = (questionaireTotal+free_questionaireTotal)/(questionaireCount+free_questionaireCount);

              userResults[q].resources[r].subresources[s]=subResourceAverage;

              resourceTotals += +subResourceAverage;
              resourceCount ++;

            }//for(var s in subresources)

            var resourceAverage = +resourceCount==0 ? 0 : (+resourceTotals/+resourceCount);

            userResults[q].resources[r].average = resourceAverage;

            resultsTable[q][r]=resourceAverage;

            lifeTotals += +resourceAverage;
            lifeCount ++;

          }//for(var r in resources)

          var lifeAverage=lifeCount==0?0:(lifeTotals/lifeCount);
          resultsTable[q].lifeAverage=lifeAverage.toFixed(2);
          chartData[q]=lifeAverage.toFixed(2);

        }for(var q=0;q<questionaires.length;q++)

        //build results table
        var resultsTableMarkup = "";

        for(var t in resultsTable){

          var row = resultsTable[t];
          resultsTableMarkup += '<tr>';

            resultsTableMarkup += '<td>' + resultsTable[t].questionaireDate + '</td>';
            resultsTableMarkup += '<td>' + resultsTable[t].lifeAverage + '</td>';
            resultsTableMarkup += '<td>' + resultsTable[t].dinheiro + '</td>';
            resultsTableMarkup += '<td>' + resultsTable[t].saúde + '</td>';
            resultsTableMarkup += '<td>' + resultsTable[t].conhecimento + '</td>';
            resultsTableMarkup += '<td>' + resultsTable[t].tempo + '</td>';
            resultsTableMarkup += '<td>' + resultsTable[t].emoção + '</td>';

          resultsTableMarkup += '</tr>';

        }//for(var t in resultsTable)
        if(resultsTableId){
            $("#"+resultsTableId).html(resultsTableMarkupBase);
            $("#resultsTable tbody").html(resultsTableMarkup);
        }

        var ctx = document.getElementById(chartContainer);
        var myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartLables,
            datasets: [{
              data: chartData,
              lineTension: 0,
              backgroundColor: 'transparent',
              borderColor: '#007bff',
              borderWidth: 4,
              pointBackgroundColor: '#007bff'
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: false
                }
              }]
            },
            legend: {
              display: false,
            }
          }
        });

      }//if(data.success)

      if(!data.success){
        console.log("questionaires couldn't be retreived!");
      }

    });//completeQuestionairesRequest.done(function(data)

}//export function updateEvolutionChart(chartContainer)

export function updateLifeScoreProjectionChart(chartCanvas,testSpeed,lifeScoreProjectionId,resources){

  console.log("got into updateLifeScore");
  console.log("resources received:");
  console.log(resources);

  var canvasLifeScoreProjection = document.getElementById(chartCanvas);

  var chartLables = [];

  var lifeScore = resources.lifeScore;

  var chartData = [];

  //algorithm to generate chart points

  const period = 20;//years
  const periods_length = 2;//months
  console.log("test_speed:"+testSpeed);
  const taxa_bimestral = Math.pow((1+testSpeed),(2/12))-1;
  console.log("taxa bimestral=" + taxa_bimestral);

  const valor_maximo = 100000;
  const sequence_group = [7, 8, 1, 2, 3, 4, 5, 6];
  const taxa_variacao_randomica = [1.41, 2.83, 4.24, -1.41, -2.83, -4.24, 1.13, 2.26, 3.39, -1.13, -2.26, -3.39, 0.91, 1.81, 2.72, -0.91, -1.81, -2.72, 0.72, 1.45, 2.17, -0.72, -1.45, -2.17];

  //iteraction 0
  var n = 0;
  var data_atual = new Date();
  var pontos = lifeScore;
  var pontos_anteriores;
  var valor_certo = pontos;
  var valor_certo_anterior;
  var variacao_do_que_falta = (valor_maximo - valor_certo) * taxa_bimestral;
  var variacao_do_que_sobra = pontos * taxa_bimestral;
  var atual_taxa_do_que_sobra = lifeScore;
  var atual_taxa_do_que_sobra_anterior;
  var variacao = taxa_bimestral > 0 ? (variacao_do_que_falta > variacao_do_que_sobra ? variacao_do_que_sobra : variacao_do_que_falta) : variacao_do_que_sobra;
  var variacao_anterior;
  var indice_randomico = taxa_variacao_randomica[Math.floor(Math.random() * 24)];
  var variacao_em_pontos = valor_certo * indice_randomico * 0.01;
  var variacao_em_pontos_anterior;
  var serie_simulada = valor_certo;
  var a;
  var b;
  var valor_do_grafico = pontos;
  var valor_do_grafico_anterior;
  chartData.push(valor_do_grafico);
  chartLables.push(data_atual.getDate() + '/' + (data_atual.getMonth() + 1) + '/' + data_atual.getFullYear());

  for(var index=0;index<(period*12/periods_length);index++){
      n++;
      if(n>sequence_group.length-1){
          n=0;
      }
      data_atual.setMonth(data_atual.getMonth()+2);
      pontos_anteriores = pontos;
      pontos = pontos_anteriores + (pontos_anteriores * taxa_bimestral);
      valor_certo_anterior = valor_certo;
      variacao_anterior = variacao;
      valor_certo = valor_certo_anterior + variacao_anterior > 0 ? valor_certo_anterior + variacao_anterior : 0;
      variacao_do_que_falta = (valor_maximo - valor_certo) * taxa_bimestral;
      variacao_do_que_sobra = pontos * taxa_bimestral;
      atual_taxa_do_que_sobra_anterior = atual_taxa_do_que_sobra;
      atual_taxa_do_que_sobra = atual_taxa_do_que_sobra_anterior + (atual_taxa_do_que_sobra_anterior * taxa_bimestral);
      variacao = taxa_bimestral > 0 ? (variacao_do_que_falta > variacao_do_que_sobra ? variacao_do_que_sobra : variacao_do_que_falta) : variacao_do_que_sobra;
      indice_randomico = +taxa_variacao_randomica[Math.floor(Math.random() * 24)];
      variacao_em_pontos_anterior = variacao_em_pontos;
      variacao_em_pontos = +valor_certo * +indice_randomico * 0.01;
      serie_simulada = valor_certo + variacao_em_pontos;
      valor_do_grafico_anterior = valor_do_grafico;

      a = (sequence_group[n]==sequence_group[0]?valor_certo:valor_do_grafico_anterior+variacao_em_pontos_anterior);
      b = ( a < 0 ? 0 : a );
      valor_do_grafico = b > valor_maximo ? valor_maximo : b;
      chartData.push(valor_do_grafico);
      chartLables.push(data_atual.getDate() + '/' + (data_atual.getMonth() + 1) + '/' + data_atual.getFullYear());

  }

  $("#"+lifeScoreProjectionId+"").html(valor_do_grafico.toFixed(0));

  try{
      var lifeScoreChart = new Chart(canvasLifeScoreProjection, {
          type: 'line',
          data: {
              labels: chartLables,
              datasets: [{
              data: chartData,
              lineTension: 0,
              fill:true,
              borderColor: "blue",
              borderWidth: 1,
              pointBackgroundColor: '#007bff'
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero: true
                      },
                          type: "linear"


                  }]
              },
              legend: {
              display: false
              }
          }
      });
  } catch(err) {
      console.log("erro ao construir o gráfico de lifeScoreProjectionChart");
      console.log("error:");
      console.log(err);
  }

}

export function buildLastQuestionaireResourcesChart(chartCanvas,errorContainerId){

  var chartLables = [];
  var chartData = [];
  var chartBackgroundColors = [];
  var chartBorderColors = [];

  var completeQuestionairesRequest = $.ajax({
        url:'/get_last_complete_user_questionaire',
        method:'GET',
        dataType: 'json',
        error:function( jqXHR, textStatus,  errorThrown){
          let errorMessageMarkup = '<div class="alert alert-danger" role="alert">'+
                                    errorThrown +
                                    '</div>';
          $("#"+errorContainerId).html(errorMessageMarkup);
          return {"success":false,"errorMessage":textStatus,"status":500};
        }
  });

  completeQuestionairesRequest.done(function(data){
    let userQuestionaire = data.userQuestionaire;
    let userId = userQuestionaire.user;
    let resourcesLayoutData = data.resourcesLayoutData;
    delete resourcesLayoutData._id;

    if(userQuestionaire.length>0){
      var lastCompleteUserQuestionaire=userQuestionaire;
      var resources = lastCompleteUserQuestionaire[0].resources;


      var resourcesArray = {};

      for(var r in resources){

        resourcesArray[r]={};
        var subresources = resources[r];
        resourcesArray[r].resourceAverage = 0;
        resourcesArray[r].o_que_fazer = [];
        var resourceSum = 0;
        var resourceCount = 0;
        resourcesArray[r].subresources={};

        for(var s in subresources){
          resourcesArray[r].subresources[s]={};
          var topics = subresources[s];
          resourcesArray[r].subresources[s].subresourceAverage = 0;
          resourcesArray[r].subresources[s].topics = {};

          resourcesArray[r].subresources[s].topics.o_que_evitar = [];
          for(var top=0;top<topics.o_que_evitar.length;top++){
            resourcesArray[r].subresources[s].topics.o_que_evitar.push(topics.o_que_evitar[top].option);
          }

          var questionaireSum = 0;
          var questionaireCount = 0;

          for(var q in topics.questionaire){
              questionaireCount ++;
              questionaireSum  += +topics.questionaire[q].score;
          }

          for(var q in topics.free_questionaire){
              questionaireCount ++;
              questionaireSum  += (+topics.free_questionaire[q].answerOrder)*2;
          }

          var subresourceAverage = +(questionaireSum / questionaireCount);
          resourceCount ++;
          resourceSum += +subresourceAverage;

          resourcesArray[r].o_que_fazer.push(
            {topic:topics.o_que_fazer[0].option,subresourceAverage:subresourceAverage}
          );

          resourcesArray[r].subresources[s].subresourceAverage = subresourceAverage;
        }

        var resourceAverage = (+resourceSum/+resourceCount)
        resourcesArray[r].resourceAverage = resourceAverage;

        var resourceColor;
        //search for resource color:
        for(var rsrc in resourcesLayoutData){
          if(r==resourcesLayoutData[rsrc].title.pt){
            resourceColor = "#" + resourcesLayoutData[rsrc].color;
          }
        }

        chartLables.push(r);
        chartData.push(resourceAverage);
        chartBackgroundColors.push(resourceColor);
        chartBorderColors.push(resourceColor);

      }

      var ctx = document.getElementById(chartCanvas);
       var summaryChart = new Chart(ctx, {
         type: 'bar',
         data: {
           labels: chartLables,
           datasets: [{
             data: chartData,
             lineTension: 0,
             fill:true,
             backgroundColor: chartBackgroundColors,
             borderColor: chartBorderColors,
             borderWidth: 1,
             pointBackgroundColor: '#007bff'
           }]
         },
         options: {
           scales: {
             yAxes: [{
               ticks: {
                 beginAtZero: true
               }
             }]
           },
           legend: {
             display: false
           }
         }
       });

    }


    //insert on what to do and what to avoid cards
    let whatToAvoidMarkup = "";
    let whatToDoMarkup = "";

    for(var resourceIndex in resourcesArray){
      let resource = resourcesArray[resourceIndex];
      let whatToDoArray = resource.o_que_fazer;
      let whatToAvoidArray = resource.o_que_evitar;

      if(whatToDoArray!=undefined){
        whatToDoMarkup += '<!-- .todo-header -->'+
                          '<div class="todo-header"> '+resourceIndex+' </div><!-- /.todo-header -->';
        for(let i in whatToDoArray){

          whatToDoMarkup += '<!-- .todo -->'+
                            '<div class="todo">'+
                              '<!-- .custom-control -->'+
                              '<div class="custom-control custom-checkbox">'+
                                '<input type="checkbox" class="custom-control-input" id="todo-userId-'+userId+'-resource-'+resourceIndex+'-topicIndex-'+i+'">'+
                                '<label class="custom-control-label" for="toavoid-userId-'+userId+'-resource-'+resourceIndex+'-topicIndex-'+i+'">'+
                                  (whatToDoArray[i].topic).toLowerCase() + '</label>'+
                              '</div><!-- /.custom-control -->'+
                            '</div><!-- /.todo -->'
        }//for(let i in resource.o_que_fazer)
      }//if(resource.o_que_fazer.length>0)
      if(whatToAvoidArray!=undefined){
        whatToAvoidMarkup += '<!-- .todo-header -->'+
                          '<div class="todo-header"> '+resourceIndex+' </div><!-- /.todo-header -->';
        for(let i in whatToAvoidArray){

          whatToAvoidMarkup += '<!-- .todo -->'+
                            '<div class="todo">'+
                              '<!-- .custom-control -->'+
                              '<div class="custom-control custom-checkbox">'+
                                '<input type="checkbox" class="custom-control-input" id="toavoid-userId-'+userId+'-resource-'+resourceIndex+'-topicIndex-'+i+'">'+
                                '<label class="custom-control-label" for="toavoid-userId-'+userId+'-resource-'+resourceIndex+'-topicIndex-'+i+'">'+
                                  (whatToAvoidArray[i].topic).toLowerCase() + '</label>'+
                              '</div><!-- /.custom-control -->'+
                            '</div><!-- /.todo -->'
        }//for(let i in resource.o_que_evitar)
      }//if(resource.o_que_evitar.length>0)
    }//for(var resourceIndex in resourcesArray)

    $(".todo-list[action='o_que_fazer']").html(whatToDoMarkup);
    $(".todo-list[action='o_que_evitar']").html(whatToDoMarkup);

  });

}//function buildLastQuestionaireResourcesChart
