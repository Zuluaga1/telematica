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