const express = require('express');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const bodyParser = require('body-parser');  
const mysql = require('mysql');
session = require('express-session');
const path = require('path');
const passport= require('passport');
const { json } = require('body-parser');
app.use(bodyParser());
//app.listen(80);
app.use(express.json({ limit: '1mb' }));
//para poder acceder
app.use(express.static('public'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
require('dotenv').config();


// Credentials for connecting the database
const database = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB,
    port: process.env.DB_PORT
});
 
//connect
database.connect((err) => {
    if (err){
        throw err;
    }    
    console.log('Mysql Connected...');
});


//Landing page
app.get('/', (request, response) => {
    request.session.loggedin = false;
    request.session.loggedin1 = false;
    request.session.loggedin2 = false;
    response.sendFile(path.join(__dirname + '/public/landing.html'));
});

//Login
app.get('/login', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/login.html'));
});

//Admin
app.get('/admin', function(request, response) {
	if (request.session.loggedin2) {
        return response.sendFile(path.join(__dirname + '/public/admin.html'));
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	} 
});

//Ayudante (Registro caso)
app.get('/registro_caso', function(request, response) {
	if (request.session.loggedin1) {
        return response.sendFile(path.join(__dirname + '/public/registro_caso.html'));
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	} 
});

//Ayudante (Obtener caso)
app.get('/obtener_caso', function(request, response) {
	if (request.session.loggedin1) {
        return response.sendFile(path.join(__dirname + '/public/obtener_caso.html'));
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	} 
});

//Medico (General)
app.get('/general', function(request, response) {
	if (request.session.loggedin) {
        return response.sendFile(path.join(__dirname + '/public/general.html'));
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	}
});

//Medico (Busqueda)
app.get('/busqueda', function(request, response) {
	if (request.session.loggedin) {
        return response.sendFile(path.join(__dirname + '/public/busqueda.html'));
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	}
});


app.post('/form', (req, res) => {
    database.connect(function(err) {
        let post = {nombre: req.body.nombre, apellido: req.body.apellido, cedula: req.body.cedula, rol: req.body.rol, usuario: req.body.user, contraseña: req.body.pass}; 
        let sql = 'INSERT INTO user SET ?';
        database.query(sql,post, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
    });
    res.status(204).send();
});

app.post('/estado', (req, res) => {
    var data =req.body.con;
    var id = data[0];
    var fecha_estado = data[1];
    var estado = data[2]; 
    // var currentTime = new Date();
    // var date = currentTime.toString();
    // console.log(date)
    database.connect(function(err) {
        let post = {fecha: fecha_estado, estado: estado, idcaso: id}; 
        let sql = 'INSERT INTO estado SET ?';
        database.query(sql,post, function (err, results) {
          if (err) throw err;
          res.end(JSON.stringify(results)); 
        });
    });  
});
        
app.post('/login', (req, res) => {
    var username = req.body.usuarios;
    var password = req.body.contraseñas;
    const medico = "medico";
    const ayudante = "ayudante";
    const admin = "admin";    
    if (username && password) {
        let sql = `SELECT * FROM user WHERE usuario LIKE '${username}' AND contraseña LIKE '${password}'`;
        let query = database.query(sql, (err, results) => {
            if(results.length >0){
                if (err){
                    res.send('Incorrect Username and/or Password!');
                } else if (username == results[0].usuario && password ==results[0].contraseña && ayudante == results[0].rol) {
                    req.session.loggedin1 = true;
                    req.session.username = username;
                    res.redirect('/registro_caso');
                } else if (username ==results[0].usuario && password ==results[0].contraseña && medico == results[0].rol){
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/general');
                } else if (username ==results[0].usuario && password ==results[0].contraseña && admin == results[0].rol){
                    req.session.loggedin2 = true;
                    req.session.username = username;
                    res.redirect('/admin');
                } 
            } else {
                res.status(204).send();
            }
        });
    }
});


app.post('/logeado_ayudante', (req, res) => {
    database.connect(function(err) {
        let post = {nombre: req.body.nombre, apellido: req.body.apellido, cedula: req.body.cedula, sexo: req.body.sexo, fecha_nac: req.body.fecha_nac, direccion: req.body.direccion, trabajo: req.body.trabajo, examen: req.body.examen, fecha_examen: req.body.fecha_examen}; 
        let sql1 = 'INSERT INTO registro_caso SET ?';
        database.query(sql1,post, function (err, result) {
          if (err) throw err;
        });

        let sql2 = `SELECT rc.idCaso, rc.examen, rc.fecha_examen FROM registro_caso rc
                    WHERE rc.idCaso = (SELECT MAX(rc.idCaso) FROM registro_caso rc)`;

        index();              
        async function myQuery(){
            return new Promise((resolve,reject)=>{
                database.query(sql2, function (err, result2) {
                    if (err) {throw err;}
                    resolve(result2);
                });      
            });
        }
        async function index(){
            var post2 = await myQuery()
            var id = post2[0].idCaso
            var examen = post2[0].examen
            var fecha = post2[0].fecha_examen
            if (examen == 'positivo'){
                estado = 2;
            } else {
                estado = 1;
            }
            let post = {fecha: fecha, estado: estado, idcaso: id}; 
            let sql = 'INSERT INTO estado SET ?';
            database.query(sql,post, function (err, result) {
                if (err) throw err;
            });
        }
    });
    res.status(204).send();
});

app.post('/gest_caso', (req, res) => {
    var nombre = req.body.con;
    console.log(nombre)
    let sql = `SELECT rc.idCaso, rc.nombre, rc.apellido, rc.cedula, rc.sexo, rc.fecha_nac, rc.direccion, 
                rc.trabajo, rc.examen, rc.fecha_examen, cond.estado, est.fecha FROM registro_caso rc
                INNER JOIN estado est ON rc.idCaso = est.idcaso
                INNER JOIN condicion cond ON est.estado = cond.idcondicion
                WHERE rc.nombre LIKE '${nombre}' OR rc.idCaso LIKE '${nombre}' OR rc.cedula LIKE '${nombre}'
                ORDER BY est.fecha DESC, est.idestado DESC
                LIMIT 1`;
    let query = database.query(sql, (err, results) => { 
        if (err){ throw err;}
        console.log(results)
        res.end(JSON.stringify(results));       
    });
});

app.post('/gest_caso2', (req, res) => {
    var idcaso = req.body.con;
    let sql = `SELECT es.fecha, con.estado
                FROM estado es, condicion con
                WHERE es.idcaso = '${idcaso}' AND es.estado = con.idcondicion`;
    let query = database.query(sql, (err, result) => {
        if(err){ throw err;}
        res.end(JSON.stringify(result));
        console.log(result)    
    });
});

app.post('/mapaplan', (req, res) => {
    var nombre = req.body.con;
    let sql = `SELECT * FROM registro_caso WHERE idCaso LIKE '${nombre}' OR cedula LIKE '${nombre}'`;
    let query = database.query(sql, (err, result) => {
        if(err){ throw err;}
        res.end(JSON.stringify(result));
        console.log(result)    
    });
});

app.post('/mapaplan2', (req, res) => {
    var idcaso = req.body.con;
    let sql = `SELECT es.fecha, con.estado
                FROM estado es, condicion con
                WHERE es.idcaso = '${idcaso}' AND es.estado = con.idcondicion`;
    let query = database.query(sql, (err, result) => {
        if(err){ throw err;}
        res.end(JSON.stringify(result));
        console.log(result)    
    });
});

app.post('/casos', (req, res) => {
    let sql = req.body.con;
    let query = database.query(sql, (err, result) => {
        if(err){ throw err;}
        res.end(JSON.stringify(result));
        console.log(result)    
    });
});

//Info Pagina principal
io.on('connection', socket => {

    socket.on('login', msg => {
        var username = msg[0];
        var password = msg[1];   
        if (username && password) {
            let sql = `SELECT * FROM user WHERE usuario LIKE '${username}' AND contraseña LIKE '${password}'`;
            let query = database.query(sql, (err, results) => {
                if (err) throw err;
                socket.emit("loginCheck", results)
            });
        }
    });

    socket.on('verificacionRegistro', msg => {
        let sql = msg;
        let query = database.query(sql, (err, results) => {
            if (err) throw err;
            socket.emit("checkRegistro", results)
        });
    });

    socket.on('verificacionRegistroCaso', msg => {
        let sql = msg;
        let query = database.query(sql, (err, results) => {
            if (err) throw err;
            socket.emit("checkRegistroCaso", results)
        });
    });

    socket.on('post', msg => {
        var sql = msg;
        database.connect(function(err) {
            database.query(sql, function (err, result) {
              if (err) throw err;
              console.log(result);

              var coord = [];
              for (let i = 0; i < result.length; i++) {
                var x = result[i]
                var val = Object.values(x)[1];
                coord.push(val);
            }
                console.log(coord);
                socket.emit('show', coord);
            });
        });
    });

    socket.on('post2', msg => {
        var sql = msg;
        database.connect(function(err) {
            database.query(sql, function (err, result) {
              if (err) throw err;
              console.log(result);

              var coord2 = [];
              for (let i = 0; i < result.length; i++) {
                var x = result[i]
                var val = Object.values(x)[1];
                coord2.push(val);
            }
                console.log(coord2);
                socket.emit('show2', coord2);

            });
    
        });
    });

    socket.on('post3', msg => {
        var sql = msg;
        database.connect(function(err) {
            database.query(sql, function (err, result) {
              if (err) throw err;
              console.log(result);

              var coord3 = [];
              for (let i = 0; i < result.length; i++) {
                var x = result[i]
                var val = Object.values(x)[1];
                coord3.push(val);
            }
                console.log(coord3);
                socket.emit('show3', coord3);

            });
    
        });
    });

    socket.on('post4', msg => {
        var sql = msg;
        database.connect(function(err) {
            database.query(sql, function (err, result) {
              if (err) throw err;
              console.log(result);

              var coord4 = [];
              var coord5 = [];
              var coord6 = [];
              for (let i = 0; i < result.length; i++) {
                var x = result[i]
                var val = Object.values(x)[0];
                var val2 = Object.values(x)[1];
                var val3 = Object.values(x)[2];

                val = val.toString();
                var valc = val.split(' ');
                
                val = valc[1]+' '+valc[2]+' '+valc[3]; 
                coord4.push(val);
                coord5.push(val2);
                coord6.push(val3);
            }
                console.log(coord4);
                var arrayPost4 = [];
                arrayPost4.push(coord4);
                arrayPost4.push(coord5);
                arrayPost4.push(coord6);
                socket.emit('show4',arrayPost4)
            });
    
        });
    });

});

server.listen(80, () => {
    console.log("Servidor abierto en puerto 80");
});