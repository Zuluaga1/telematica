var mostrar, data, estado, hola ;
var cedula=[];
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
var caso;
function ACT(){
    cedula = document.getElementById("txtcedula").innerHTML;
    cedula ={cedula: cedula};
    hola = act(cedula);
    /* console.log(hola[0]);
    document.getElementById("actu").innerHTML =JSON.stringify(hola, null, 4); */
    //cedula[6].id + "," +cedula[6].cedula + "," + cedula[6].fecha;

}
async function act(cedula){
    const options = {
        method: "POST",
        body: JSON.stringify(cedula),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await fetch('/cedula', options);
     estado = await response.json();


    return estado
    
}

function obtenerCaso(){
    var caso1 = document.getElementById("nombre").value;
    caso ={caso1: caso1};
    
    
    caso = asincrono(caso);
    //console.log(caso)
}

function estado_act(){
    var nombre = document.getElementById("txtnombre").innerHTML;
    var apellido = document.getElementById("txtapellido").innerHTML;
    var cedula = document.getElementById("txtcedula").innerHTML;
    var estado = document.getElementById("menu1").value;

    nombrec= nombre + apellido;
    actua ={id:cedula, estado:estado};
   
    
    caso = asincrono1(actua);
    
}

async function asincrono1(actua){
    const options = {
        method: "POST",
        body: JSON.stringify(actua),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await fetch('/estado', options);
     estado = await response.json();


    return estado
    
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