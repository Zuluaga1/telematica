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

//Check fields
if (document.getElementById('formCase') != undefined) {
    const formCase = document.getElementById('formCase')
    formCase.addEventListener('submit', (e) =>{
        e.preventDefault();
        form = e.target
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
            var query = `SELECT * FROM registro_caso rc
                        WHERE rc.cedula = '${cedula}'`
            socket.emit('verificacionRegistroCaso', query);
            socket.on('checkRegistroCaso', function(message) {
                if (message.length > 0) {
                    swal({
                        title: "ERROR!",
                        text: `Ya hay una persona registrada con el número de cedúla ingresado. Puede consultar su estado actual en la pestaña de "Obtener Caso" `,
                        icon: "warning",
                    });
                } else {
                    swal({
                        title: "HECHO!",
                        text: "El caso ha sido registrado correctamente!",
                        icon: "success",
                    });
                    form.submit()
                }  
            });
        }
    });
} else {
    //pass
}
