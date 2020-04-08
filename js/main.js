$(document).ready(function () {

    var venditeTotali=[];
    $.ajax({
        url:'http://157.230.17.132:4022/sales',
        method: 'GET',
        success: function (data) {
            var vendite = data;
            for (var i = 0; i < vendite.length; i++) {
                var vendita = vendite[i];
                var datiVendita = {
                    nomeVenditore: vendita.salesman,
                    quantity: parseInt(vendita.amount),
                    date: moment(vendita.date, 'DD-MM-YYYY').format('MMMM')
                }

                venditeTotali.push(datiVendita);

            }
            var objVenditeMensile = {};

            for (var i = 0; i < venditeTotali.length; i++) {
                var oggettoSingolo = venditeTotali[i];
                var mese = oggettoSingolo.date;
                if (objVenditeMensile[mese] === undefined) {
                    objVenditeMensile[mese] = 0;
                }
                objVenditeMensile[mese] += oggettoSingolo.quantity;
            }
            console.log(objVenditeMensile);

            var labelsMese = [];
            var dataMese = [];

            for (var key in objVenditeMensile) {
                labelsMese.push(key);
                dataMese.push(objVenditeMensile[key]);
            }

            var ctx = $('#grafico-vendite');
            var chart = new Chart(ctx, {
                type: 'line',

                data: {
                    labels: labelsMese,
                    datasets: [{
                        label: 'Grafico Vendite 2017',
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: dataMese
                    }]
                },


            });

    },
        error: function () {

        }
    });



});
