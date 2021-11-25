const cors = require('cors');

//EXPRESS: INFRAESTRUCTURA DE APLICACIONES WEB NODE.JS
const express = require('express');
const { listenerCount } = require('process');
const app = express();
const path = require('path');
const axios = require("axios");
const { promisify, isBuffer } = require("util");

// Puerto de escucha de node.js API (9000)      
app.listen(9000,() => console.log('listening port 9000'));

//
app.use(cors())

// Creación cliente redis. Conectado a docker.             
var redis = require('redis');
const { addAbortSignal } = require('stream');
var client = redis.createClient(); 

// Promisifying Get and set methods
const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

// Conectamos con redis, automáticamente puerto 6379
client.on('connect', function() {
    console.log('connected');
});

// Flush a la base de datos cada vez que iniciamos la API
client.flushdb( function (err, succeeded) {
    console.log(succeeded); 
});

// Cargamos .html => Inicialiación de BD redis
app.get('/',function(req,res){
    cargar_personajes(); 
    f_itinerario();
    armas();
    res.sendFile(path.join(__dirname+'/index.html'));
});

///FUNCIONES PARA CARGAR REDIS AL INICIALIZARSE LA API///
///<------------------------------------------------->\\\

// Inicializamos en redis tres listas con los diferentes
// itinerarios de armas
async function f_itinerario(){
    client.rpush('itinerario:0', [1, 2, 3, 4, 5, 6]);
    client.rpush('itinerario:1', [4, 3, 6, 1, 5, 2]);
    client.rpush('itinerario:2', [6, 3, 5, 4, 2, 1]);
}

// Inicializamos en redis un bloque hash para cada arma
// con sus correspondientes atributos
async function armas(){
    await  client.del('personaje:-1');
    for(let i=0;i<7;i++){
        var precision = Math.floor(Math.random() * (100 - 50) + 50);
        var daño = Math.floor(Math.random() * (100 - 50) + 50);
        var arma = 'arma:' + i;
        client.hmset(arma,'numero',i,'precision',precision,'daño',daño);
    }
}

// Carga de personajes 
async function cargar_personajes(){
    // Search Data in Redis
    const reply = await GET_ASYNC("character");

    // if exists returns from redis and finish with response
    if (reply) return res.send(JSON.parse(reply));

    // Fetching Data from Rick and Morty API
    const response = await axios.get(
        "https://rickandmortyapi.com/api/character/?page=1"
    );

    const response2 = await axios.get(
        "https://rickandmortyapi.com/api/character/?page=2"
    );

    var array = (response.data.results).concat(response2.data.results);
    
    // resond to client, hash para cada jugador
    for(let i=1;i<=20;i++){
            var _name = array[i].name;
            var imagen = array[i].image;
            var itinerario = Math.floor(Math.random() * (3 - 0));
            var id = 'personaje:' + i;
            client.hmset(id,'id',i,'nombre',_name, 'vida', 100, 'muertes', 0, 'imagen', imagen, 'grupo_armas', itinerario, 'n_arma_actual', 0);
    }

}



///BUCLE PARA IR ACTUALIZANDO DE FORMA AUTOMÁTICA BD///
///<----------------------------------------------->\\\

//Cada 1s ejecuta la función especificada
var myInt = setInterval(function () {

    // pull, carga todos los datos de los jugadores de base de datos redis a proceso
    pull_datos();

    // mostramos los jugadores para ver sus armas que todo esté correcto
    //showPlayers();

 
    // simulamos una ronda de disparos 
    simular();

    //push de los datos a la base de datos redis
    //push_datos();

    
    //actualizamos el vector de jugadores por si nos hacen un app.get('/Jugador/all')
    //update_all();

    //Podemos visualiozar el estado final de todos los jugadores después de dispararse
    //showPlayersall();


    // exit si gana un jugador
    //fin_partida();

}, 2000);


//Definimos clases
class Player {
    constructor(id, nombre, n_arma_actual, itinerario, vida) {
      this.id = id;
      this.nombre = nombre;
      this.n_arma_actual = n_arma_actual;
      this.itinerario = itinerario;
      this.vida = vida;
    }
}

class PlayerReact {
    constructor(id, nombre,n_arma_actual, key_arma_actual, vida, img) {
      this.id = id;
      this.nombre = nombre;
      this.n_arma_actual = n_arma_actual;
      this.key_arma_actual = key_arma_actual;
      this.vida = vida;
      this.img = img;
    }
}





class Arma {
    constructor(precision, daño) {
      this.precision = precision;
      this.daño = daño;
    }
}

var px = new Player(-1,'nombre_default','-',-1,100);
var ar = new Arma(0,0);
var v_players = [px,px,px,px,px,px,px,px,px,px];
var v_armas = [ar,ar,ar,ar,ar,ar,ar,ar,ar,ar];
var v_kills = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];

var pr = new PlayerReact(-1,'nombre_default', -1,-1,100, 'no_img');
var v_players_all = [pr,pr,pr,pr,pr,pr,pr,pr,pr,pr,pr,pr,pr,pr,pr,pr,pr,pr,pr,pr];


function fin_partida(){
    if(ganador!='-') console.log('Winner...player: '+ ganador +' !!!');
}

// Muestra atributos de jugadores por terminal para ver
// como evolucionan a lo largo de la partida
function showPlayers(){

    for(var i=0;i<10;i++){
        console.log('nombre ' + v_players[i].nombre);
        console.log('id ' + v_players[i].id);
        console.log('vida ' + v_players[i].vida);
        console.log('daño ' + v_armas[i].daño);
        console.log('precision ' + v_armas[i].precision);
    }
}

function showPlayersall(){

    for(var i=0;i<20;i++){
        console.log('ID ' + v_players_all[i].id);
        console.log('nombre ' + v_players_all[i].nombre);
        console.log('n_arma_actual ' + v_players_all[i].n_arma_actual);
        console.log('key_arma_actual ' + v_players_all[i].key_arma_actual);
        console.log('vida ' + v_players_all[i].vida);
        console.log('Imagen ' + v_players_all[i].img);
    }
}

async function update_all() {
    //10 jugadores aleatorios colocados en el vector
    var arr = [0,1,2,3,4,5,6,7,8,9], itinerario=[0,0];
    var nombre = '-', key_arma_actual = '-';
    var n_arma_actual = -1, arma_actual=0, vida=100, daño=100, precision=100, key_arma=-1; 

    // para cada uno de ellos obttendremos sus atributos y armas 
    for (let i = 0; i < 20; i++) {

        // cada posición del vector contiene uno de los 20 posibles jugadores
        var personaje = 'personaje:' + i;

        // obtenemos su nombre
        await client.hget(personaje, 'nombre', function(err, reply) {
            nombre = reply;
        });

        // obtenemos su número de arma actual
        await client.hget(personaje, 'n_arma_actual', function(err, reply) {
            n_arma_actual = reply;
        });

        // obtenemos su vida
        await client.hget(personaje, 'vida', function(err, reply) {

            vida = reply;
            // vida es el último atributo para generar el jugador y añadirlo
            // de forma permanente a un vector
            var p = new PlayerReact(i, nombre, n_arma_actual, key_arma, vida,'no_img');
            v_players_all[i] = p;
        });
    }

    for (let i = 0; i < 20; i++) {

        var personaje2 = 'personaje:' + i;

        // obtenemos su itinerario
        await client.hget(personaje2, 'grupo_armas', function(err, reply) {

            itinerario = 'itinerario:' + reply;
            // sabiendo su itinerario, obtenemos su arma actual
            client.lindex(itinerario,v_players_all[i].n_arma_actual,function(err, reply) {

                key_arma= reply;
                v_players_all[i].key_arma_actual=key_arma;

            });
        });
    }

    //Mario IMG
    for (let i = 0; i < 20; i++) {

        var personaje3 = 'personaje:' + i;

        // obtenemos su itinerario
        await client.hget(personaje3, 'imagen', function(err, reply) {

                var imgAux= reply;
                v_players_all[i].img=imgAux;

        });
    }
    //Mario IMG
}
1

var id_personajes = ['','','','','','','','','',''];
var ids =  [0,0,0,0,0,0,0,0,0,0];

async function pull_datos() {

   

    for (let i = 0; i < 10; i++) {
        
        var inserit = false;

        while (!inserit){

            var personaje = 'personaje:' + Math.floor(Math.random() * (20 - 1) + 1);
            //console.log('personaje creando: ' + personaje);

            var repe = false;
            for(let j=0; j<=i; j++){

                if(personaje== id_personajes[j]) repe = true;
               
            }
            
            if(!repe){ 
                id_personajes[i]= personaje;
                inserit=true;
            }
        }

    }

    // para cada uno de ellos obttendremos sus atributos y armas 
    for (let i = 0; i < 10; i++) {

        personaje=id_personajes[i];
        //console.log('personaje fuera: ' + personaje);

        actualizarVector(personaje, i);
        
        
    }
}


async function actualizarVector(personaje, i){



    await client.hmget(personaje,'nombre','n_arma_actual','grupo_armas','vida', 'id',function(err, reply) {

        //console.log(personaje);
        var p = new Player(reply[4], reply[0], reply[1], reply[2], reply[3]);
        v_players[i] = p;
        var  itinerario = 'itinerario:' + reply[2];
        client.lindex(itinerario,reply[1],function(err, reply2) {
            var key_arma_actual = 'arma:' + reply2;
            client.hmget(key_arma_actual,'precision','daño', function(err, reply3) {
                var a = new Arma(reply3[0],reply3[1]);
                v_armas[i-1] = a;
            });
        });
    });





}





// Función para simular disparos entre 10 jugadores cada cierto periodo de tiempo.
async function simular(){

    //console.log('ANTES DE DISPARARSE__________________________________________');

    //showPlayers();

    for(let i=0;i<5;i++){
        var p1 = v_players[i*2]; var w1 = v_armas[i*2]; var prec1 = w1.precision; var daño1 = w1.daño;
        var p2 = v_players[i*2+1]; var w2 = v_armas[i*2+1]; var prec2 = w2.precision; var daño2 = w2.daño;
        var visibilidad = Math.floor(Math.random() * (100 - 0));
        var zset1 = 'kills:' + p1.id;
        var zset2 = 'kills:' + p2.id;
        var string_personaje = 'personaje:' + v_players[i*2].id;
        var string_personaje2 = 'personaje:' + v_players[i*2+1].id;

        //reducir código repetido -->
        if(prec1 > visibilidad){
            //console.log('TIPO 1 VISIBILIDAD');
            //p2.vida = p2.vida - w1.daño;
            v_players[i*2+1].vida = v_players[i*2+1].vida - w1.daño;

            client.hset(string_personaje2, 'vida', v_players[i*2+1].vida);


            if(v_players[i*2+1].vida<=0){ //p1 mata a p2
                //añadimos la muerte a un 


                //client.zadd(zset1,0,v_players[i*2+1].nombre);
                client.zincrby(zset1,1,v_players[i*2+1].nombre);

                v_kills[i*2] =  v_players[i*2].id;
                v_kills[i*2+1] =  v_players[i*2+1].id;

                

                v_players[i*2+1].vida = 100;
                client.hset(string_personaje2, 'vida', v_players[i*2+1].vida);
                
                //ZADD myzset 1 "one"
                //p2.vida = 100;
                if(v_players[i*2].n_arma_actual<6){
                    client.hset(string_personaje, 'n_arma_actual', Number(v_players[i*2].n_arma_actual)+1);
                    //console.log('TIPO 1');
                    //console.log(Number(p1.n_arma_actual) + 1);
                    //console.log(zset1);
                    //console.log(p1.nombre);

                    console.log('SOY ' + p1.nombre + 'CON ID ' + p1.id+ ' MATO A ' + p2.nombre);

                    v_players[i*2].n_arma_actual = Number(v_players[i*2].n_arma_actual) + 1;
                    v_players[i*2+1].vida = 100;
                    //p1.n_arma_actual = Number(p1.n_arma_actual) + 1;
                    
                    /*var string_personaje = 'personaje:' + v_players[i*2].id;    
            
                    // push n_arma_actual 'redis'
                    await client.hset(string_personaje, 'n_arma_actual', Number(p1.n_arma_actual) + 1, (err, res) => {})
                    
                    var string_personaje2 = 'personaje:' + v_players[i*2+1].id; 
                    // push vida 'redis'
                    await client.hset(string_personaje2, 'vida', p2.vida, (err, res) => {})*/
                    
                }
            }
        }
        
        /*if(prec2 > visibilidad){ //p2 mata a p1
            p1.vida = p1.vida - w2.daño;
            v_players[i*2].vida = p1.vida;
            if(p1.vida<=0){
                p1.vida = 100;
                client.zadd(zset2,1,p1.nombre);
                if(p2.n_arma_actual<6){
                    console.log('TIPO 2');
                    console.log(Number(p2.n_arma_actual) + 1);
                    console.log(zset2);
                    console.log(p2.nombre);
                    v_players[i*2+1].n_arma_actual = Number(p2.n_arma_actual) + 1;
                    v_players[i*2].vida = 100;
                    //p2.n_arma_actual = Number(p2.n_arma_actual) + 1;

                    /*var string_personaje = 'personaje:' + v_players[i*2+1].id;    
            
                    // push n_arma_actual 'redis'
                    await client.hset(string_personaje, 'n_arma_actual', Number(p2.n_arma_actual) + 1, (err, res) => {})
                    
                    var string_personaje2 = 'personaje:' + v_players[i*2].id; 
                    // push vida 'redis'
                    await client.hset(string_personaje2, 'vida', p1.vida, (err, res) => {})
                }
            }
        }*/
    }

   
}

// Actualizamos los valores de los jugadores a la base de datos
async function push_datos() {

    //console.log('DESPUES DE DISPARARSE__________________________________________');
    //showPlayers();
    for (let i = 0; i < 10; i++) {

        // key personaje y clase personaje
        var string_personaje = 'personaje:' + v_players[i].id;
        var personaje = v_players[i];

        

        actualizar_datos_push(string_personaje, personaje);

    }

    /*for (let i = 0; i < 5; i++) {

        var zset1 = 'kills:' + v_players[i*2].id;

    
        actualizar_datos2(zset1,v_players[i*2+1].nombre);

    }*/

    

}

async function actualizar_datos2(zset1,nombre){

    await client.zadd(zset1,1,nombre);

}



async function actualizar_datos_push(string_personaje, personaje ){

         // push n_arma_actual 'redis'
         await client.hset(string_personaje, 'n_arma_actual', personaje.n_arma_actual, (err, res) => {})

         // push vida 'redis'
         await client.hset(string_personaje, 'vida', personaje.vida, (err, res) => {})
}



//INICIALIZACIÓN BASE DE DATOS RICKY MORTY
// Get all characters
app.get("/character", async (req, res, next) => {
    try {
      // Search Data in Redis
      const reply = await GET_ASYNC("character");
  
      // if exists returns from redis and finish with response
      if (reply) return res.send(JSON.parse(reply));
  
      // Fetching Data from Rick and Morty API
      const response = await axios.get(
        "https://rickandmortyapi.com/api/character"
      );
  
      // Saving the results in Redis. The "EX" and 10, sets an expiration of 10 Seconds
      const saveResult = await SET_ASYNC(
        "character",
        JSON.stringify(response.data),
        "EX",
        10
      );
  
      // resond to client
      for(let i=1;i<20;i++){
        var name = response.data.results[i].name;
        var imagen = response.data.results[i].image;
        var numero_random = Math.floor(Math.random() * (3 - 0));
        var id = 'presonaje:' + i;
        //client.sadd('rickymorty',response.data.results[i].name);
        //HASH 
        client.hset(id, 'nombre', name);
        client.hset(id, 'vida', 100);
        client.hset(id, 'muertes', 0);
        client.hset(id, 'imagen', imagen);
        client.hset(id, 'grupo_armas', numero_random);
        client.hset(id, 'n_arma_actual', 0);
      }

      //Mario presonaje
        var id = 'personaje:' + 0;
        var numero_random = Math.floor(Math.random() * (3 - 0));
        var imagen = response.data.results[19].image;
        client.hset(id, 'nombre', 'myPlayer');
        client.hset(id, 'vida', 100);
        client.hset(id, 'muertes', 0);
        client.hset(id, 'imagen', imagen);
        client.hset(id, 'grupo_armas', numero_random);
        client.hset(id, 'n_arma_actual', 0);   
      //Mario




      res.send(response.data);
    } catch (error) {
      res.send(error.message);
    }
  });


//Servei de resposta a les PETICIONS DE REACT

//GET ALL
    app.get('/Jugador/all', function(req, res) {

        var arrayAux = v_players_all;
        arrayAux.sort(compare);
        res.send(arrayAux);
    });


//UpDATE MYPLAYER
    app.post('/updatePlayerKills/:kills', function(req, res) {

        //console.log('Got a POST request');
        //console.log(req.params.kills);
        var kills = req.params.kills;
        update_kills(kills);
        
    });

    async function update_kills(kills){

        //console.log('Dentro funcion update_kills');
        //console.log(kills);
        var personaje = 'personaje:' + 0;
        var muertes = 0;

        await client.hget(personaje, 'n_arma_actual', function(err, reply) {
            n_arma_actual = reply;
            //console.log(n_arma_actual);
            var set = parseInt(n_arma_actual) + parseInt(kills);
            client.hset(personaje, 'n_arma_actual', set );
            update_all();
        });

        //showPlayersall();
    }

    app.post('/updatePlayerVida/:vida', function(req, res) {

        //console.log('Got a POST request');
        //console.log(req.params.vida);
        var vida = req.params.vida;
        update_vida(vida);
    });

    async function update_vida(vida){

        //console.log('Dentro funcion update_vida');
        //console.log(vida);
        var personaje = 'personaje:' + 0;
        
        await client.hget(personaje, 'vida', function(err, reply) {

            vida_act = reply;
            //console.log('La vida antes de actualizar: ' + vida_act);
            var set = parseInt(vida_act) - parseInt(vida);
            client.hset(personaje, 'vida', set );
            update_all();
        });
    }
  

//EXISTS
    app.get('/exists/:id', function(req, res) {
        var personaje = 'personaje:' + req.params.id;
        if (client.exists(personaje,  function(err, reply) {
            if (reply == 1) {
                res.send('exists');
            } else {
                res.send('doesn\'t exist');
            }
        }));
    });


    

function compare(a, b) {


    if (a.n_arma_actual > b.n_arma_actual) return -1;
    if (b.n_arma_actual > a.n_arma_actual) return 1;
  
    return 0;
  }

