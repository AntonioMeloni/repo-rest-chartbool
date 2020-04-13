$(document).ready(function () {

    var baseUrl = 'http://157.230.17.132:4022/sales';
    stampaGrafici();
    $('.btn-input').click(function () {
        var vendorName = $('.vendor-name').val();
        var dataNuovaVendita = moment($('.data-vendita').val(), 'YYYY-MM-DD').format('DD/MM/YYYY');
        var valoreVendita = parseInt($('.valore-vendita').val());
        nuovaVendita(vendorName, dataNuovaVendita, valoreVendita);
        stampaGrafici();
    })

    function stampaGrafici() {
        $.ajax({
            url: baseUrl,
            method: 'GET',
            success: function (data) {
                //console.log(data);
                //Elaboro i dati ricevuti dal server per farne 2 array
                //do in pasto a charjs i 2 array
                var datiMensili = costruttoreDatiMensili(data);
                createLineChart(datiMensili.mese,datiMensili.vendite);
                var datiquarter = costruttoreDatiMensili(data);
                createBarChart(datiMensili.quarter,datiMensili.venditaQuarter);
                var fatturato = fatturatoTotale(data);
                var datiVenditori = costruttoreDatiVenditori(data, fatturato);
                createPieChart(datiVenditori.vendite,datiVenditori.venditori);
            },
            error: function (err) {
                alert('Errore');
            }
        });
    }

    function nuovaVendita(vendorName, dataNuovaVendita, valoreVendita) {
        $.ajax({
            url: baseUrl,
            method: 'POST',
            data:{
                salesman: vendorName,
                amount: valoreVendita,
                date: dataNuovaVendita
            },
            success: function (data) {
                console.log(data);
            },
            error: function (err) {
                alert('Errore');
            }
        })
    }

    function costruttoreDatiMensili(vendite) {
        var venditeMensili ={
            gennaio: 0,
            febbraio: 0,
            marzo: 0,
            aprile: 0,
            maggio: 0,
            giugno: 0,
            luglio: 0,
            agosto: 0,
            settembre: 0,
            ottobre: 0,
            novembre: 0,
            dicembre: 0,
        };

        var venditeQuarter = {
            1: 0,
            2: 0,
            3: 0,
            4: 0
        }
        for (var i = 0; i < vendite.length; i++) { //ciclo nelle vendite che ho ricevuto dal GET er aggiugngere.amount all'oggetto venditeMensili
            var vendita = vendite[i]; //valuto ogni singola vendita
            var dataVendita = vendita.date; //estrapolo la data dall'oggetto vendita
            var meseVendita = moment(dataVendita, 'DD/MM/YYYY').format('MMMM');// trasformo la data nel nome del mese
            var quarterMese = moment(vendita.date, 'DD/MM/YYYY').quarter();
            console.log(quarterMese);
            venditeMensili[meseVendita] += parseInt(vendita.amount); //uso il nome del mese appena ricavato per riconsocere la chiave dell'oggetto venditeMensile per aggiungere a questa la vendita appatenente a quel mese
            venditeQuarter[quarterMese] += parseInt(vendita.amount);
        }
        console.log(venditeQuarter);
        var arrayMesi=[]; //inizializzo i due array da utilizzare in charjs
        var arrayVendite=[];
        for (var nomeMese in venditeMensili) { //ciclo allinterno dell'oggetto venditeMensili per trasformare la coppia chive-valore in due array
            arrayMesi.push(nomeMese); //inserisco il nome del mese nell'arrayMesi
            arrayVendite.push(venditeMensili[nomeMese]); // inserisco nell'arreyVendite la somma di tutte le vendite relative a quel mese
        }
        var arrayQuarter=[]; //inizializzo i due array da utilizzare in charjs
        var arrayVenditeQuarter=[];
        for (var quarter in venditeQuarter) { //ciclo allinterno dell'oggetto venditeMensili per trasformare la coppia chive-valore in due array
            arrayQuarter.push(quarter); //inserisco il nome del mese nell'arrayMesi
            arrayVenditeQuarter.push(venditeQuarter[quarter]); // inserisco nell'arreyVendite la somma di tutte le vendite relative a quel mese
        }
        console.log(arrayQuarter, arrayVenditeQuarter);

        return {
            mese: arrayMesi,
            vendite: arrayVendite,
            quarter: arrayQuarter,
            venditaQuarter: arrayVenditeQuarter
        };
    }

    function fatturatoTotale(vendite) {
        var fatturato = 0;
        for (var i = 0; i < vendite.length; i++) {
            var vendita=vendite[i];
            fatturato += parseInt(vendita.amount);
        }
        return fatturato;
    }

    function costruttoreDatiVenditori(vendite, fatturatoAziendale) {
        var venditeVenditori = {}; //Creazione oggetto vuoto con la somma delle vendite annuali di ogni singolo venditore
        for (var i = 0; i < vendite.length; i++) { // ciclo for nella GET
            var vendita = vendite[i]; // considero il singolo oggetto dell'array
            var nomeVenditore = vendita.salesman; // associo a una variabile il nome del venditore
            if (venditeVenditori[nomeVenditore] === undefined) { // se non esiste una chiave con il nome di quel venditore la inizializzo con il valore 0
                venditeVenditori[nomeVenditore] = 0;
            }
            venditeVenditori[nomeVenditore] += parseInt(vendita.amount); // sommo la vendita dell'oggetto iesimo a quel venditore
        }
        var arrayVenditori=[]; //inizializzo i due array da utilizzare in charjs
        var arrayVendite=[];
        for (var nomeVenditore in venditeVenditori) { //ciclo allinterno dell'oggetto venditeMensili per trasformare la coppia chive-valore in due array
            arrayVenditori.push(nomeVenditore); //inserisco il nome del mese nell'arrayMesi
            var fatturatoPercentualeVenditore = ((venditeVenditori[nomeVenditore]/fatturatoAziendale)*100).toFixed(2);
            arrayVendite.push(fatturatoPercentualeVenditore); // inserisco nell'arreyVendite la somma di tutte le vendite relative a quel venditore
        }
        return {
            venditori: arrayVenditori,
            vendite: arrayVendite
        };
    }

    function createLineChart(labels, data) {
        var ctx = $('#grafico-vendite');
                var chart = new Chart(ctx, {
                    type: 'line',

                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Grafico Vendite 2017',
                            borderColor: 'rgb(255, 99, 132)',
                            lineTension: 0,
                            data: data
                        }]
                    },


                });
    }

    function createBarChart(labels, data) {
        var ctx = $('#grafico-bar');
                var barchart = new Chart(ctx, {
                    type: 'bar',

                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Grafico  Quarter Vendite 2017',
                            backgroundColor: [
                             'lightcoral',
                             'lightblue',
                             'lightgreen',
                             'yellow'],

                            data: data
                        }]
                    },


                });
    }

    function createPieChart(arrayData,arrayLabels) {
        var ctx = $('#grafico-salesman');
        var piechart = new Chart(ctx, {
            type: 'pie',
            data: {
                datasets: [{
                    barPercentage: 0.5,
                    barThickness: 6,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    data: arrayData,
                    backgroundColor: [
                     'lightcoral',
                     'lightblue',
                     'lightgreen',
                     'yellow']
                }],
                labels: arrayLabels
            },
            options: {
                responsive: true,
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                    }
                  }
                }
            }
        });
    }

});
