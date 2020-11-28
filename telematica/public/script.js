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

async function obtenerCaso(){
    const caso = document.getElementById("inputCaso").value;
    const consulta = {con:caso};
    const options = {
        method: "POST",
        body: JSON.stringify(consulta),
        headers: {
            "Content-Type": "application/json"
        }
    };

    const response = await fetch('/gest_caso', options);
    result = await response.json();
    
    if (result.length > 0){
        //Simplify addresses
        var nac = result[0].fecha_nac.split("T")
        var examen = result[0].fecha_examen.split("T")
        var est = result[0].fecha.split("T")
        var fecha_nac = nac[0];
        var fecha_examen = examen[0];
        fecha_estado = est[0];

        document.getElementById("idcaso").innerHTML = result[0].idCaso;
        document.getElementById("nombre_completo").innerHTML = result[0].nombre +" "+ result[0].apellido;
        document.getElementById("cedula").innerHTML = result[0].cedula;
        document.getElementById("sexo").innerHTML = result[0].sexo;
        document.getElementById("fecha_nac").innerHTML = fecha_nac;
        document.getElementById("casa").innerHTML = result[0].direccion;
        document.getElementById("trabajo").innerHTML = result[0].trabajo;
        document.getElementById("examen").innerHTML = result[0].examen;
        document.getElementById("fecha_examen").innerHTML = fecha_examen;
        document.getElementById("estado").innerHTML = result[0].estado;
        document.getElementById("fecha_estado").innerHTML = fecha_estado;

        //Enable datepicker
        document.getElementById("fecha").disabled = false;
        $("#fecha").datetimepicker({
            format: 'Y-m-d',
            onShow: function(ct) {
                this.setOptions({
                    minDate: document.getElementById("fecha_estado").value != '' ? fecha_estado : false
                })
            },
            timepicker: false
        });
        //

        //TABLE
        var id = result[0].idCaso;
        const consulta2 = {con:id};
        const options2 = {
            method: "POST",
            body: JSON.stringify(consulta2),
            headers: {
                "Content-Type": "application/json"
            }
        };  

        const response2 = await fetch('/gest_caso2', options2);
        result1 = await response2.json();

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
}

async function actualizarCaso(){
    if (document.getElementById("inputCaso").value != '' && document.getElementById("fecha_estado").value != '' && document.getElementById("fecha").value != ''){
        if (document.getElementById("estado").innerHTML != 'Muerte') {
            var data = [];
            var id = document.getElementById("idcaso").innerHTML;
            var fecha_estado = document.getElementById("fecha").value;
            var estado_actual = document.getElementById("lista_estados").value;
            data.push(id)
            data.push(fecha_estado)
            data.push(estado_actual)

            const consulta = {con:data};
            const options = {
                method: "POST",
                body: JSON.stringify(consulta),
                headers: {
                    "Content-Type": "application/json"
                }
            };  

            const response = await fetch('/estado', options);
            result = await response.json();
            swal({
                title: "HECHO!",
                text: "La actualización del caso se ha realizado correctamente!",
                icon: "success",
            });
            document.forms['formUpdate'].reset()
            document.forms['obtenerCaso'].reset() 
        } else {
            swal({
                title: "ERROR!",
                text: "La actualización del caso no se puede realizar ya que el paciente falleció",
                icon: "warning",
            });
        }  
    } else {
        swal({
            title: "ERROR!",
            text: "Debe ingresar un valor en todos los campos",
            icon: "warning",
          });
    }
}









//FORMS

//Login check
if (document.getElementById('formLogin') != undefined) {
    const formLogin = document.getElementById('formLogin')
    formLogin.addEventListener('submit', (e) =>{
        e.preventDefault();
        user = e.target.elements.usuarios.value;
        pass = e.target.elements.contraseñas.value;
        let form = e.target
        if (user == "" && pass == "") {
            swal({
                title: "ERROR!",
                text: "Debes ingresar tu usuario y contraseña para acceder",
                icon: "warning",
            });
        } else if (user == "") {
            swal({
                title: "ERROR!",
                text: "Debes ingresar tu usuario para acceder",
                icon: "warning",
            });
        } else if (pass == "") {
            swal({
                title: "ERROR!",
                text: "Debes ingresar tu contraseña para acceder",
                icon: "warning",
            });
        } else {
            var content = [];
            content.push(user);
            content.push(pass);
            socket.emit("login", content)
            form.submit()
        }
    });
} else {
    //pass
}

//Check if user and password r incorrect
socket.on('loginCheck', function(message) {
    if (message.length > 0) {
        //pass
    } else {
        swal({
            title: "ERROR!",
            text: "El usuario ingresado es incorrecto. Intente de nuevo",
            icon: "warning",
        });
    }
});


//User Register
if (document.getElementById('formAdmin') != undefined) {
    const formAdmin = document.getElementById('formAdmin')
    formAdmin.addEventListener('submit', (e) =>{
        e.preventDefault();
        nombre = e.target.elements.nombre.value;
        apellido = e.target.elements.apellido.value;
        cedula = e.target.elements.cedula.value;
        user = e.target.elements.user.value;
        pass = e.target.elements.pass.value;
        let form = e.target
        if (nombre == "" || apellido == "" || cedula == "" || user == "" || pass == "" ) {
            swal({
                title: "ERROR!",
                text: "Todos los campos deben ser ingresados",
                icon: "warning",
            });
        } else {
            swal({
                title: "HECHO!",
                text: "El usuario ha sido registrado correctamente!",
                icon: "success",
            });
            form.submit()
            document.forms['formAdmin'].reset()
        }
    });
} else {
    //pass
}


//Update
if (document.getElementById('formUpdate') != undefined) {
    const formUpdate = document.getElementById('formUpdate')
    formUpdate.addEventListener('submit', (e) =>{
        e.preventDefault();
        let form = e.target
        if (document.getElementById("inputCaso").value == '' || document.getElementById("fecha_estado").value == '' || document.getElementById("fecha").value == ''){ 
            swal({
                title: "ERROR!",
                text: "Todos los campos deben ser ingresados",
                icon: "warning",
            });
        } else {
            if (document.getElementById("estado").innerHTML != 'Muerte') {
                swal({
                    title: "HECHO!",
                    text: "La actualización del caso se ha realizado correctamente!",
                    icon: "success",
                });
                form.submit()
                document.forms['formUpdate'].reset()
                document.forms['obtenerCaso'].reset() 
            } else {
                swal({
                    title: "ERROR!",
                    text: "La actualización del caso no se puede realizar ya que el paciente falleció",
                    icon: "warning",
                });
            } 
        }
    });
} else {
    //pass
}

//Check if the address is valid
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


