$(document).ready(function () {

    var venditeTotali=[];
    $.ajax({
        url:'http://157.230.17.132:4022/sales',
        method: 'GET',
        success: function (data) {

            var vendite = data;
            var fatturatoMese = [0,0,0,0,0,0,0,0,0,0,0,0];
            var objVenditeMensile = {};
            var objSalesMan = {};
            var fatturatoTotale = 0;
            for (var i = 0; i < vendite.length; i++) {
                var oggettoSingolo = vendite[i];
                var mese = parseInt(moment(oggettoSingolo.date, 'DD-MM-YYYY').format('M')); //1
                console.log(oggettoSingolo.date, mese)
                var nome = oggettoSingolo.salesman;
                fatturatoTotale += parseInt(oggettoSingolo.amount);

                fatturatoMese[mese - 1] += oggettoSingolo.amount;

                if (objSalesMan[nome] === undefined) {
                    objSalesMan[nome] = 0;
                }
                objSalesMan[nome] += oggettoSingolo.amount;
            }

            console.log(fatturatoMese);

            var labelsNomiSales = [];
            var dataVendite = [];
            for (var key in objSalesMan) {
                labelsNomiSales.push(key);
                dataVendite.push(Math.round((objSalesMan[key]/fatturatoTotale)*100));
            }

            var ctx = $('#grafico-vendite');
            var chart = new Chart(ctx, {
                type: 'line',

                data: {
                    labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre', ],
                    datasets: [{
                        label: 'Grafico Vendite 2017',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: fatturatoMese ,
                    }]
                },


            });

            var ctx = $('#grafico-salesman');
            var chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    datasets: [{
                        data: dataVendite,
                        backgroundColor: ['lightcoral',
                         'lightblue',
                         'lightgreen',
                         'yellow']
                    }],


                    labels: labelsNomiSales
                }
            });
        },
        error: function () {

        }
    });



});
