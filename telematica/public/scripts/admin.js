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