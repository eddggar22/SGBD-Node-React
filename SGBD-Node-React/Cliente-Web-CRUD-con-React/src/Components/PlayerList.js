import React, { useState, useEffect } from 'react';
import axios from 'axios'


const PlayerList = (() => {

    const [jugadores, setJugadores] = useState([])
    
    useEffect(() => {
     const getJugadores = () => {
        axios.get('http://localhost:9000/Jugador/all').then(res => {
        if (res.data[0] !== "-") {
          clearTimeout(game);
          window.location.assign("http://localhost:3000/resultados");
        }
        var response = [];
        for (var i = 0; i < 20; i++) {
          response[i] = res.data[i + 1];
        }
        setJugadores(response)
      })
      .catch(err => { console.log(err) })
     }
     var game = setInterval(() => {
       getJugadores();
     }, 3000);
    }, [])

    return ( 
        <table className='table'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Kills</th>
                    <th>Arma Actual</th>
                    <th>Vida</th>
                    <th>Imagen</th>
                </tr>
            </thead>
            <tbody>
                {jugadores.map(jugador =>(
                 <tr>
                    <th>{jugador.id}</th>
                    <th>{jugador.nombre}</th>
                    <th>{jugador.n_arma_actual}</th>
                    <td>
                     <img src={`/images/${jugador.key_arma_actual}.png`}  alt="40" height="40" />
                    </td>
                    <th>{jugador.vida}</th>
                    <td>
                    <img src={jugador.img} alt="40" height="40" />
                    </td>
                  </tr>
                ))}
            </tbody>
        </table>
    );
})
 
export default PlayerList;