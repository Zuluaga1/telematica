//initMap();
var map;
var geocoder;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12, center: { lat: 10.949185, lng: -74.803391 },
    streetViewControl: false
  });
  geocoder = new google.maps.Geocoder();
}

async function search(){
        
        if (document.getElementById('inputSearch').value != ""){
          initMap();
          var input = document.getElementById('inputSearch').value;
          const consulta = {con:input};
          const options1 = {
            method: "POST",
            body: JSON.stringify(consulta),
            headers: {
                "Content-Type": "application/json"
            }
          };
          const response1 = await fetch('/mapaplan', options1);
          result = await response1.json();
          console.log(result);

          if (result.length > 0){
          //Simplify addresses
          var nac = result[0].fecha_nac.split("T")
          var examen = result[0].fecha_examen.split("T")
          var fecha_nac = nac[0];
          var fecha_examen = examen[0];
          
          document.getElementById("idcaso").innerHTML = result[0].idCaso;
          document.getElementById("nombre_completo").innerHTML = result[0].nombre +" "+ result[0].apellido;
          document.getElementById("cedula").innerHTML = result[0].cedula;
          document.getElementById("sexo").innerHTML = result[0].sexo;
          document.getElementById("fecha_nac").innerHTML = fecha_nac;
          document.getElementById("casa").innerHTML = result[0].direccion;
          document.getElementById("trabajo").innerHTML = result[0].trabajo;
          document.getElementById("examen").innerHTML = result[0].examen;
          document.getElementById("fecha_examen").innerHTML = fecha_examen;

          var address = result[0].direccion;
          var address1 = result[0].trabajo;

          geocoder.geocode({'address': address}, function(results1, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              map.setCenter(results1[0].geometry.location);
              var marker = new google.maps.Marker({
                map: map,
                icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                animation: google.maps.Animation.DROP,
                position: results1[0].geometry.location
              });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
          });
            
          geocoder.geocode({'address': address1}, function(results2, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              map.setCenter(results2[0].geometry.location);
              var marker = new google.maps.Marker({
                map: map,
                icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                animation: google.maps.Animation.DROP,
                position: results2[0].geometry.location
              });
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });

          var id = result[0].idCaso;
          const consulta2 = {con:id};
          const options2 = {
            method: "POST",
            body: JSON.stringify(consulta2),
            headers: {
                "Content-Type": "application/json"
            }
          };
           
          const response2 = await fetch('/mapaplan2', options2);
          result1 = await response2.json();

          console.log(result1);
          var table = document.getElementById('table');
          table.innerHTML = "";

          result1.forEach(function(object) {
            var tr = document.createElement('tr');

            var fecha1 = object.fecha.split("T")
            var fecha2 = fecha1[0];

            tr.innerHTML = '<th>' + fecha2 + '</th>' + '<td>' + object.estado + '</td>';
            table.appendChild(tr);
          });
        } else {
          swal({
            title: "ERROR!",
            text: "No hay registros del caso ingresado",
            icon: "warning",
          });
        }
      } else {
          swal({
            title: "ERROR!",
            text: "Se debe ingresar la cédula del paciente o el ID del caso ",
            icon: "warning",
          });
        }
    }