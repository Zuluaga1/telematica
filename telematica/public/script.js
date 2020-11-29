var mostrar, data;
var caso;

function cambia_register(){
    location.href="/"
}

function cambia_login(){
    location.href="/acceder"
}

function registrarCaso(){
    location.href="/home"
}

function gestCaso(){
    location.href="/gest_caso"
}



// function obtenerCaso(){
//     var caso1 = document.getElementById("nombre").value;
//     caso ={caso1: caso1};
//     caso = asincrono(caso);
//     console.log(caso)
// }

function estado_act(){
    var nombre = document.getElementById("txtnombre").value;
    var apellido = document.getElementById("txtapellido").value;
    nombrec= nombre + apellido
    actua ={nombre: nombrec };
    caso = asincrono(actua);
    console.log(caso)
}

//Check fields
if (document.getElementById('formCase') != undefined) {
    const formCase = document.getElementById('formCase')
    formCase.addEventListener('submit', (e) =>{
        e.preventDefault();
        let form = e.target
        nombre = e.target.elements.nombre.value;
        apellido = e.target.elements.apellido.value;
        cedula = e.target.elements.cedula.value;
        sexo = e.target.elements.sexo.value;
        fecha_nac = e.target.elements.fecha_nac.value
        direccion = e.target.elements.direccion.value
        trabajo = e.target.elements.trabajo.value
        examen = e.target.elements.examen.value
        fecha_examen = e.target.elements.fecha_examen.value
        
        if (nombre == "" || apellido == "" || cedula == "" || fecha_nac == "" || fecha_nac == "" || direccion == "" || trabajo == "" || fecha_examen == ""){
            swal({
                title: "ERROR!",
                text: "Todos los campos deben ser ingresados",
                icon: "warning",
            });
        } else {
            swal({
                title: "HECHO!",
                text: "El registro del caso se ha realizado correctamente!",
                icon: "success",
            });
            form.submit()
            document.forms['formCase'].reset()
        }
    });
} else {
    //pass
}

function initMap() {
    geocoder = new google.maps.Geocoder();
    input1 = document.getElementById("direccion");
    searchBox1 = new google.maps.places.SearchBox(input1);
    input2 = document.getElementById("trabajo");
    searchBox2 = new google.maps.places.SearchBox(input2);

    searchBox1.addListener("places_changed", () => {
        const places = searchBox1.getPlaces();
    
        if (places.length == 0) {
          return;
        }
    });

    searchBox2.addListener("places_changed", () => {
        const places = searchBox2.getPlaces();
    
        if (places.length == 0) {
          return;
        }
    });
}


