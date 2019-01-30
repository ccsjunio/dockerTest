import {
          updateEvolutionChart,
          updateLifeScoreProjectionChart,
        buildLastQuestionaireResourcesChart
      } from './../utils/lib.mjs';

$(document).ready(async function(){

    var lifeScore = 1;
    var average = 0;
    var sum = 0;
    var counter = 0;
    var resources = {};
    try{
        $(".resourceValue[resource]").each(function(){
            let value = $(this)[0].textContent;
            let resource = $(this).attr("resource");
            lifeScore *= +value;
            sum += +value;
            counter++;
            resources[resource]=value;
            console.log("resource got:"+resource);
            console.log("value for resource " + resource + ":" + value);
        });
        resources.lifeScore = lifeScore;
        resources.average = (sum/counter).toFixed(2);

    } catch(err) {
        console.log("erro ao iterar por cada input resource");
        console.log("error:");
        console.log(err);
    }

    updateEvolutionChart("evolution-chart-canvas");

    updateLifeScoreProjectionChart("projection-chart-canvas",0.1,"lifeScoreProjection",resources);

    buildLastQuestionaireResourcesChart("summary-chart-canvas", "summary-chart-canvas");

});//document.ready


function updateLifeScore(){
    //calculation life score

    return lifeScore;
}

function updateAverageScore(){
    //calculation life score
    var sum = 0;
    var counter = 0;
    try{
        $("input[resource][typeOfInput='value']").each(function(){
            let value = $(this).val();
            sum += +value;
            counter++;
        });
    } catch(err) {
        console.log("erro ao iterar por cada input resource");
        console.log("error:");
        console.log(err);
    }
    return sum/counter;
}
