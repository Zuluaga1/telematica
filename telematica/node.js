const express = require('express');
const app = express();
const bodyParser = require('body-parser');  
const mysql = require('mysql');
session = require('express-session');
const path = require('path');
const passport= require('passport');
const { json } = require('body-parser');
app.use(bodyParser());
app.listen(80);
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
    //port:   "8111"
});

//connect
/* database.connect((err) => {
    if (err){
        throw err;
    }    
    console.log('Mysql Connected...');
});  */
//dirección para el logeo
app.get('/acceder', function(request, response) {
    response.sendFile(path.join(__dirname + '/public/login.html'));
    //console.log(__dirname + '/public/login.html')
});

app.post('/form', (req, res) => {
    //let nombre1=req.body.nombre1;
    //console.log(req.body);
    database.connect(function(err) {
        let post = {nombre: req.body.nombre, apellido: req.body.apellido, cedula: req.body.cedula, rol: req.body.rol, usuario: req.body.usuario, contraseña: req.body.contraseña}; 
        let sql = 'INSERT INTO user SET ?';
        database.query(sql,post, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
          //console.log(post.nombre)
          
          //const password=post.contraseña;
        });
    });
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
    
    var username =req.body.usuarios;
    var password =req.body.contraseñas;
    //console.log(req.body);
    const medico = "medico";
    const ayudante = "ayudante";    
        //console.log(results);
    //});
    if (username && password) {
        //console.log(username, password);
        let sql = `SELECT * FROM user WHERE usuario LIKE '${username}' AND contraseña LIKE '${password}'`;
        //let sql = `SELECT * FROM user WHERE usuario, contraseña, rol = (SELECT ${username}==(usuario) and ${password}==(contraseña) FROM user)`;
         let query = database.query(sql, (err, results) => { 
         if(results.length >0){
            if (err){
                res.send('Incorrect Username and/or Password!');
            }
                
                else if (username ==results[0].usuario && password ==results[0].contraseña && ayudante == results[0].rol) {
				    req.session.loggedin = true;
				    req.session.username = username;
                    res.redirect('/logeado_ayudante');
                 
            } else if(username ==results[0].usuario && password ==results[0].contraseña && medico == results[0].rol){
                req.session.loggedin = true;
				    req.session.username = username;
                    res.redirect('/logeado_medico');
                }
        }   else {
                    res.send('Incorrect Username and/or Password!');
            }
    });
	} else {
		res.send('Please enter Username and Password!');
		res.end();
    }
    
    /* let sql1 =(`SELECT * FROM user WHERE usuario, contraseña"  ${req.body.usuarios} and ${req.body.contraseñas}`);
    let query = database.query(sql1, (err, result) => {
        if (err) throw err;
    res.end(JSON.stringify(result));
    console.log("correcto");
    }); */
});
app.get('/logeado_ayudante', function(request, response) {
    
	if (request.session.loggedin) {
       
        return response.sendFile(path.join(__dirname + '/public/registro.html'));
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

app.get('/logeado_ayudante', function(request, response) {
    
	if (request.session.loggedin) {
       
        return response.sendFile(path.join(__dirname + '/public/registro.html'));
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	}
    
    
});


app.get('/logeado_medico', function(request, response) {
	if (request.session.loggedin) {
        return response.sendFile(path.join(__dirname + '/public/logeado_medico.html'));
        
	} else {
        return response.sendFile(path.join(__dirname + '/public/login.html'));
	}
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
    console.log(req.body);

    let sql = `SELECT * FROM registro_caso WHERE idCaso LIKE '${nombre}' OR cedula LIKE '${nombre}'`;
    let query = database.query(sql, (err, result) => {
        if(err){ throw err;}
        res.end(JSON.stringify(result));
        console.log(result)    
    });
});

app.post('/mapaplan2', (req, res) => {
    var idcaso = req.body.con;
    console.log(req.body);

    let sql = `SELECT es.fecha, con.estado
                FROM estado es, condicion con
                WHERE es.idcaso = '${idcaso}' AND es.estado = con.idcondicion`;
    let query = database.query(sql, (err, result) => {
        if(err){ throw err;}
        res.end(JSON.stringify(result));
        console.log(result)    
    });
});