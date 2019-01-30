$(document).ready(function(){

    $("#simulatedLifeScoreProjectionRateRange").on("change",function(e){
        e.preventDefault();
        e.stopPropagation();
        let value = $(this).val();
        $("#simulatedLifeScoreProjectionRate").html(value);
        updateLifeScoreProjectionChart();
    });
    
    
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
        updateLifeScoreProjectionChart();
        //$("#simulatedLifeScore").html(updateLifeScore().toFixed(0));
        //$("#simulatedResourceAverage").html(updateAverageScore().toFixed(2));
    });

    updateLifeScoreProjectionChart();
    //$("#simulatedLifeScore").html(updateLifeScore().toFixed(0));
    //$("#simulatedResourceAverage").html(updateAverageScore().toFixed(2));


});//document.ready

function updateLifeScoreProjectionChart(){
    
    var canvasLifeScoreProjection = document.getElementById("canvas-life-score-projection");

    //var chartBackgroundColors = ["blue"];
    //var chartBorderColors = ["blue"];

    var chartLables = [
    ];
    
    var lifeScore = updateLifeScore();
    
    var chartData = [
    ];

    //algorithm to generate chart points
    
    const period = 20;//years
    const periods_length = 2;//months
    const simulatedLifeScoreProjectionRateSpan = $("#simulatedLifeScoreProjectionRate");
    const test_speed = parseInt(simulatedLifeScoreProjectionRateSpan[0].textContent)/100;
    console.log("test_speed:"+test_speed);
    const taxa_bimestral = Math.pow((1+test_speed),(2/12))-1;
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

    $("#simulatedLifeScoreProjection").html(valor_do_grafico.toFixed(0));
    
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

function updateLifeScore(){
    //calculation life score
    var lifeScore = 1;
    try{
        $("input[resource][typeOfInput='value']").each(function(){
            let value = $(this).val();
            lifeScore *= value;
        });
        $("#simulatedLifeScore").html(parseInt(lifeScore));
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