"use strict";

let userResults = [];
let resultsTable = [];
let chartLables = [];
let chartData = [];

let completeQuestionairesRequest = $.ajax({
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

          for(let qindex=0;qindex<questionaireTopic.length;qindex++){
              questionaireTotal += +questionaireTopic[qindex].score;
              questionaireCount ++;
          }

          var free_questionaire = subresources[s].free_questionaire ? subresources[s].free_questionaire : {};

          var free_questionaireTotal = 0;
          var free_questionaireCount = 0;

          for(let qindex=0;qindex<free_questionaire.length;qindex++){
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

      var data1 = {
        labels: chartLables,
        datasets: [{
          label: 'Questionários completos',
          borderColor: Looper.colors.brand.teal,
          backgroundColor: Looper.colors.brand.teal,
          data: chartData,
        }] // init achievement chart

      };
      var canvas = $('#canvas-achievement')[0].getContext('2d');
      var chart = new Chart(canvas, {
        type: 'bar',
        data: data1,
        options: {
          tooltips: {
            mode: 'index',
            intersect: true
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: true,
                drawBorder: false,
                drawOnChartArea: false
              }
            }],
            yAxes: [{
              gridLines: {
                display: true,
                borderDash: [8, 4]
              },
              ticks: {
                stepSize: 1
              }
            }]
          }
        }
      });
            

  }//if(data.success)


  if(!data.success){
      console.log("questionaires couldn't be retreived!");
  }


  });//completeQuestionairesRequest.done(function(data)






