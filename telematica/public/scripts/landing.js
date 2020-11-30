//Solicitudes a la DB
//1. Casos positivos y negativos
var query = "SELECT  rc.examen, COUNT(rc.examen) AS Total FROM registro_caso rc GROUP by rc.examen";
socket.emit('post',query);


//2. Total de infectados (en tratamiento casa, en tratamiento hospital, en UCI, muertos)
var query2 = `SELECT  e.estado, COUNT(e.idcaso) FROM estado e
                  INNER JOIN (SELECT idcaso, MAX(fecha) AS reciente FROM estado GROUP BY idcaso) aux 
                  ON e.idcaso = aux.idcaso
                  AND e.fecha = aux.reciente
                  WHERE e.estado != 1 AND e.estado != 5
                  GROUP BY e.estado
                  ORDER BY e.estado`;
socket.emit('post2',query2);


//3. Total de casos (infectados, muertes, curados),
var query3 = `SELECT e.estado, COUNT(e.idcaso) AS Total FROM estado e
                  INNER JOIN (SELECT idcaso, MAX(fecha) AS reciente FROM estado GROUP BY idcaso) aux 
                  ON e.idcaso = aux.idcaso
                  AND e.fecha = aux.reciente
                  WHERE e.estado != 1
                  GROUP BY e.estado
                  ORDER BY e.estado`;
socket.emit('post3',query3);


//4. Cantidad de casos registrados por día
var query4= `SELECT rc.fecha_examen, COUNT(rc.examen) AS CCR, 0 AS CM FROM registro_caso rc 
                WHERE rc.examen='positivo' 
                GROUP by rc.fecha_examen 
                UNION ALL 
                SELECT e.fecha, 0, COUNT(e.estado) FROM estado e 
                WHERE e.estado=6 
                GROUP by e.fecha 
                ORDER BY fecha_examen`;
socket.emit('post4',query4);



//Graficas
var ctx1 = document.getElementById('myChart1');
var ctx2 = document.getElementById('myChart2');
var ctx3 = document.getElementById('myChart3');
var ctx4 = document.getElementById('myChart4');


// Grafica de casos positivos y negativos
socket.on('show', function(message) {
    var myPieChart = new Chart(ctx1, {
    type: 'pie',
    data: {
      labels: ["Casos positivos", "Casos negativos"],
      datasets: [{
        data: [message[0], message[1]],
        backgroundColor: ["#ff0000", "#008f39"]
      }]
    },
    options: {
      responsive: true
    }
  });
  });


// Gráfica total de infectados (en tratamiento casa, en tratamiento hospital, en UCI, muertos)
socket.on('show2', function(message) {
    var myPieChart2 = new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: ["Tratamiento Casa", "Tratamiento Hospital", "UCI", "Muerto"],
      datasets: [{
        data: [message[0], message[1], message[2], message[3]],
        backgroundColor: ["#FFB600", "#FF6400", "#003EFF", "#000000"]
      }]
    },
    options: {
      responsive: true
    }
    });
});


// Grafica Total de casos (infectados, muertes, curados) 
socket.on('show3', function(message) {
    var myPieChart3 = new Chart(ctx3, {
    type: 'pie',
    data: {
      labels: ["Infectados", "Curados", "Muertos"],
      datasets: [{
        data: [message[0]+message[1]+message[2], message[3], message[4]],
        backgroundColor: ["#ff0000", "#000000", "#008f39"]
      }]
    },
    options: {
      responsive: true
    }
  });
});


// Grafica cantidad de casos registrados por día
socket.on('show4', function(msg) {
  var message = msg[0];
  var message1 = msg[1];
  var message2 = msg[2];

  for (let i = 0; i < message.length; i++) {
    var lqws = message[i];
    if (lqws== message[i+1]){
        message1.splice(i+1,1)
        console.log(message1)
        message2.splice(i,1)
        console.log(message2)
        message.splice(i,1)
        console.log(message)
      }
  }

  var myBarChart = new Chart(ctx4, {
    type: 'line',
    data: {
      labels: message,
      datasets: [{
      label: "Registrados",
      fill: false,
      data: message1,
      borderColor: "#ff0000"
    },
    {
      label: "Muertos",
      fill: false,
      data: message2,
      borderColor: "#000000"
    }]    
    },
    options: {
        responsive:true,
      scales: {
      yAxes:[{
        scaleStepWidth:1
      }],
      xAxes: [{
          gridLines: {
              offsetGridLines: true
          }
      }]
      }
      
    }
  });
});