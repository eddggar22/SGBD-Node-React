const express=require('express')
const cors=require('cors')
const mysql=require('mysql')
const app = express()
app.use(cors())

const credentials={
    host: 'localhost',
    user: 'arun',
    password: 'password',
    database: 'curses',
    port: 3307

}

app.get('/info',(req,res)=>{
   var connection=mysql.createConnection(credentials)
   connection.query('SELECT alias, nom FROM usuaris',(error,result)=>{
       if(error){
           res.status(500).send(error)
       }else{
           res.status(200).send(result)
       }
   })
   connection.end()
})
app.listen(4000,()=>console.log('servidor MySQL'))