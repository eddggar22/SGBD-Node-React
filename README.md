# Projecte de base de dades: Redis

En aquest repositori hi han els servidors i el front que hem desenvolupat, esta dividit en 3 directoris diferents. A continuació hi ha una explicació de cada directori i com posar-lo en marxa.

El projecte ha estat realitzat per: Edgar Santos, Mario Santos, Pedro Arroniz, Raúl Bermejo i Sergi Martínez. 

## Servidor Redis (./serverRedis)

Aquest directori conté el codi per executar el servidor Redis. Per executar-lo cal tenir en el Docker isntal·lat el redis. Amb el reids obert al Docker, per instal·lar tots els paquets i executar el servidor s'han d'executar les següents comandes:

```
cd ./serverRedis
npm install
node ./app.js
```

## Servidor SQL (./serverMySQL)

Aquest directori conté el codi font del servidor SQL que hem configurat. S'han de seguir els mateixos pasos que en el cas anterior, accedir al directori, descarregar els paquets i executar.

```
cd ./serverMySQL
npm install
node ./index.js
```

## Front end (./SGBD-Node-React)

Aquest directori conté el codi font del front end que hem realitzat. Per executar-lo es necessiten les següents comandes:

```
cd ./SGBD-Node-React/Cliente-Web-CRUD-con-React
npm install
npm start
```