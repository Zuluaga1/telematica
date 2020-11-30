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

//Check if user and password r incorrect (alert)
socket.on('loginCheck', function(message) {
    if (message.length > 0) {
        //pass
    } else {
        swal({
            title: "ERROR!",
            text: "El usuario o la contraseña ingresada son incorrectos. Intente de nuevo",
            icon: "warning",
        });
    }
});