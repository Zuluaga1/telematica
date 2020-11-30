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
        form = e.target;
        if (nombre == "" || apellido == "" || cedula == "" || user == "" || pass == "" ) {
            swal({
                title: "ERROR!",
                text: "Todos los campos deben ser ingresados",
                icon: "warning",
            });
        } else {
            var query = `SELECT * FROM user u
                        WHERE u.cedula = '${cedula}' OR u.usuario = '${user}'`
            socket.emit('verificacionRegistro', query);
            socket.on('checkRegistro', function(message) {
                if (message.length > 0) {
                    swal({
                        title: "ERROR!",
                        text: "El usuario o el número de cedula ingresada ya existen. Intente otra vez",
                        icon: "warning",
                    });
                } else {
                    swal({
                        title: "HECHO!",
                        text: "El usuario ha sido registrado correctamente!",
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