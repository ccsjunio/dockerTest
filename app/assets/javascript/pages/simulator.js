$(document).ready(function(){

    $("input[typeOfInput='range']").on("change",function(e){
        e.preventDefault();
        e.stopPropagation();
        let value = $(this).val();
        let resource = $(this).attr("resource");
        $("input[typeOfInput='value'][resource='"+resource+"']").val(value);
    });

    $("input[typeOfInput='value']").on("change",function(e){
        e.preventDefault();
        e.stopPropagation();
        let value = $(this).val();
        let resource = $(this).attr("resource");
        $("input[typeOfInput='range'][resource='"+resource+"']").val(value);
    });

    $("input[resource]").on("change", function(event){
        event.preventDefault();
        event.stopPropagation();
        updateLifeScoreChart();
        updateResourcesScoreChart();
        $("#simulatedLifeScore").html(updateLifeScore().toFixed(0));
        $("#simulatedResourceAverage").html(updateAverageScore().toFixed(2));
    });

    updateLifeScoreChart();
    updateResourcesScoreChart();
    $("#simulatedLifeScore").html(updateLifeScore().toFixed(0));
    $("#simulatedResourceAverage").html(updateAverageScore().toFixed(2));


});//document.ready

function updateLifeScoreChart(){
    
    var canvasLifeScore = document.getElementById("canvas-life-score");

    var chartBackgroundColors = ["blue"];
    var chartBorderColors = ["blue"];

    var chartLables = [
        "Nota da Vida"
    ];
    
    let lifeScore = updateLifeScore();
    

    var chartData = [
        lifeScore
    ];

    try{
        var lifeScoreChart = new Chart(canvasLifeScore, {
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
                            min:0,
                            max:100000,
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
        console.log("erro ao construir o gráfico de lifeScoreChart");
        console.log("error:");
        console.log(err);
    }

    
}

function updateResourcesScoreChart(){
    
    var canvasResourcesScore = document.getElementById("canvas-resources-score");

    var chartBackgroundColors = [
        "#547f2e",
        "#4e96d3",
        "#a65a80",
        "#ffc100",
        "#ff2f28"
    ];
    var chartBorderColors = [
        "#547f2e",
        "#4e96d3",
        "#a65a80",
        "#ffc100",
        "#ff2f28"
    ];

    var chartLables = [
        "dinheiro",
        "saúde",
        "conhecimento",
        "tempo",
        "emoção"
    ];

    var chartData = [];
    
    //calculation resources score
    var lifeScore = 1;
    try{
        let resources = ["money","health","knowledge","time","emotion"];
        for(let r of resources){
            let inputElement = $("input[resource='"+r+"'][typeOfInput='value']");
            let value = inputElement.val();
            chartData.push(value);
        }
        
    } catch(err) {
        console.log("erro ao iterar por cada input resource para o gráfico de recursos");
        console.log("error:");
        console.log(err);
    }
    
    try{
        var lifeScoreChart = new Chart(canvasResourcesScore, {
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
                            min:0,
                            max:10,
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
        console.log("erro ao construir o gráfico de resourcesScoreChart");
        console.log("error:");
        console.log(err);
    }

    
}

function updateLifeScore(){
    //calculation life score
    var lifeScore = 1;
    try{
        $("input[resource][typeOfInput='value']").each(function(){
            let value = $(this).val();
            lifeScore *= value;
        });
    } catch(err) {
        console.log("erro ao iterar por cada input resource");
        console.log("error:");
        console.log(err);
    }
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