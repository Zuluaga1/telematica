//Pestaña general

initMap();
casos();

var map;
var geocoder;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12, center: { lat: 10.949185, lng: -74.803391 },
    streetViewControl: false
  });
  geocoder = new google.maps.Geocoder();
}

async function casos(){
  var sql = `SELECT  r.direccion, e.fecha, e.estado, e.idcaso FROM estado e
            INNER JOIN registro_caso r ON e.idcaso = r.idCaso
            INNER JOIN (SELECT idcaso, MAX(fecha) AS reciente FROM estado GROUP BY idcaso) aux 
            ON e.idcaso = aux.idcaso
            AND e.fecha = aux.reciente`
  const consulta = {con:sql};
  const options1 = {
    method: "POST",
    body: JSON.stringify(consulta),
    headers: {
      "Content-Type": "application/json"
    }
  };

  const response1 = await fetch('/casos', options1);

  //Clean previous markers
  if (typeof markers !== "undefined") {
    for (var i=0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  result = await response1.json();
  console.log(result);

  if (typeof markers == "undefined") {
    markers = [];
  }
        
  for (let index = 0; index < result.length; index++) {
    const persona = result[index];
    const address = persona['direccion'];
    geocoder.geocode({'address': address}, function(results1, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (persona['estado'] == 1){
          var marker = new google.maps.Marker({
            map: map,
            icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            animation: google.maps.Animation.DROP,
            position: results1[0].geometry.location
           });
        } else if (persona['estado'] == 2 || persona['estado'] == 3){
          var marker = new google.maps.Marker({
          map: map,
          icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
          animation: google.maps.Animation.DROP,
          position: results1[0].geometry.location
          });
        } else if (persona['estado'] == 4){
          var marker = new google.maps.Marker({
          map: map,
          icon: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
          animation: google.maps.Animation.DROP,
          position: results1[0].geometry.location
          });
        } else if (persona['estado'] == 5){
          var marker = new google.maps.Marker({
          map: map,
          icon: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
          animation: google.maps.Animation.DROP,
          position: results1[0].geometry.location
          });
        } else {
          var marker = new google.maps.Marker({
          map: map,
          icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          animation: google.maps.Animation.DROP,
          position: results1[0].geometry.location
          });
        }
        markers.push(marker);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });              
  } 
}
