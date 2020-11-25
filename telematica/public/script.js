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



function obtenerCaso(){
    var caso1 = document.getElementById("nombre").value;
    caso ={caso1: caso1};
    caso = asincrono(caso);
    console.log(caso)
}

function estado_act(){
    var nombre = document.getElementById("txtnombre").value;
    var apellido = document.getElementById("txtapellido").value;
    nombrec= nombre + apellido
    actua ={nombre: nombrec };
    caso = asincrono(actua);
    console.log(caso)
}

function newRow(){
    var newRow = $("<tr>");
    var cols = "";

    var cols = "";

    cols += '<td><input type="text" class="form-control" name="name' + counter + '"/></td>';
    cols += '<td><input type="text" class="form-control" name="mail' + counter + '"/></td>';
    cols += '<td><input type="text" class="form-control" name="phone' + counter + '"/></td>';
        newRow.append(cols);
        $("table.order-list").append(newRow);
        counter++;
}


async function asincrono(caso){
    const options = {
        method: "POST",
        body: JSON.stringify(caso),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await fetch('/gest_caso', options);
     data = await response.json();
    //console.log(data[0].nombre);
    /* data[0].forEach(object => {
        data.push({ nombre: object.nombre, apellido: object.apellido});
    }); */

    document.getElementById("txtnombre").innerHTML = data[0].nombre;
    document.getElementById("txtapellido").innerHTML = data[0].apellido;
    document.getElementById("txtcedula").innerHTML = data[0].cedula;
    document.getElementById("txtsexo").innerHTML = data[0].sexo;
    document.getElementById("txtfech_na").innerHTML = data[0].fecha_nac;
    document.getElementById("txtresi").innerHTML = data[0].direccion;
    document.getElementById("txttrab").innerHTML = data[0].trabajo;
    document.getElementById("txtexa").innerHTML = data[0].examen;
    document.getElementById("txtfech_ex").innerHTML = data[0].fecha_examen;

    return data
    
}
//console.log(data);



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



