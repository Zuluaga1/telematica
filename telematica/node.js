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


// Credentials for connecting the database
const database = mysql.createConnection({
    host: "covid.cvsabxwakxjs.us-east-1.rds.amazonaws.com",
    user: "ADDBPFT",
    password: "pftele08",
    database: "covid",
    port:   "3306"
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
    response.sendFile(path.join(__dirname + '/public/landing.html'));
});

app.get('/login', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/login.html'));
});

//dirección para el logeo
app.get('/acceder', function(request, response) {
    response.sendFile(path.join(__dirname + '/public/login.html'));
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
    //let nombre1=req.body.nombre1;
    console.log(req.body.estado);
    let currentTime = new Date();
    database.connect(function(err) {
        let post = {fecha: currentTime, estado: req.body.estado}; 
        let sql = 'INSERT INTO estado SET ?';
        database.query(sql,post, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
          //console.log(post.nombre)
          
          //const password=post.contraseña;
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
                    res.redirect('/logeado_ayudante');
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


app.get('/admin', function(request, response) {
	if (request.session.loggedin2) {
        return response.sendFile(path.join(__dirname + '/public/admin.html'));
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	} 
});


app.get('/logeado_ayudante', function(request, response) {
	if (request.session.loggedin1) {
        return response.sendFile(path.join(__dirname + '/public/registro.html'));
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	} 
});

app.get('/general', function(request, response) {
	if (request.session.loggedin) {
        return response.sendFile(path.join(__dirname + '/public/general.html'));
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	}
});


app.post('/logeado_ayudante', (req, res) => {
    //console.log(req.body);
    database.connect(function(err) {
        let post = {nombre: req.body.nombre, apellido: req.body.apellido, cedula: req.body.cedula, sexo: req.body.sexo, fecha_nac: req.body.fecha_nac, direccion: req.body.direccion, trabajo: req.body.trabajo, examen: req.body.examen, fecha_examen: req.body.fecha_examen}; 
        let sql = 'INSERT INTO registro_caso SET ?';
        database.query(sql,post, function (err, result) {
          if (err) throw err;
          console.log("se registró el caso correctamente");
          //console.log(post.nombre)    
          
          //const password=post.contraseña;
        });
       

    });
});

app.get('/gest_caso', function(request, response) {
    
    if (request.session.loggedin) {
        return response.sendFile(path.join(__dirname + '/public/gest_caso.html'));
        
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	}
	response.end();
    //console.log(__dirname + '/public/login.html')
});

app.post('/gest_caso', (req, res) => {
    
    var nombre = req.body.caso1;
    console.log(req.body);
    //var param = req.body.caso1;
    let sql = `SELECT * FROM registro_caso WHERE nombre LIKE '${nombre}' OR id LIKE '${nombre}' OR cedula LIKE '${nombre}'`;
    let query = database.query(sql, (err, results) => { 
        if(results.length >0){
           if (err){
               res.send('No se encuentra');
           }
        }else{
            res.send('Incorrect Username and/or Password!');
           }
           console.log(results)
           res.end(JSON.stringify(results));       
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