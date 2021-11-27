const express=require('express')
const cors=require('cors')
const mysql=require('mysql')
const app = express()
const { request } = require('express')
app.use(cors())

const credentials={
    host: 'localhost',
    user: 'arun',
    password: 'password',
    database: 'clasificacionsJugadors',
    port: 3307

}

app.get('/info',(req,res)=>{
   var connection=mysql.createConnection(credentials)
   connection.query('SELECT nom, puntuacio FROM clasificacio',(error,result)=>{
       if(error){
           res.status(500).send(error)
       }else{
           res.status(200).send(result)
       }
   })
   connection.end()
})

app.get('/insertarPersonatges', function(req,res){
    console.log(req.query);
    let nomJug = req.query.param1;
    let puntuacioJug = req.query.param2;
    console.log(nomJug);
    console.log(puntuacioJug);
    
    var connection = mysql.createConnection(credentials)

    var sql = "INSERT IGNORE INTO clasificacio (nom, puntuacio) VALUES (?, ?)";
    connection.query(sql,[nomJug, puntuacioJug], function(error, result) {
        if(error){
            throw error;
        }
    })
})

app.get('/actualitzarPersonatges', function(req,res){
    console.log(req.query);
    let nomJug = req.query.param1;
    let puntuacioJug = req.query.param2;
    console.log(nomJug);
    console.log(puntuacioJug);
    
    var connection = mysql.createConnection(credentials)

    var sql = "UPDATE clasificacio SET puntuacio = ? WHERE nom = ?";
    connection.query(sql,[puntuacioJug, nomJug], function(error, result) {
        if(error){
            throw error;
        }
    })
})

app.listen(4000,()=>console.log('servidor MySQL'))