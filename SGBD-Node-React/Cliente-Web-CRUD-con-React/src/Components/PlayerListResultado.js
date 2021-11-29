import React, { useState, useEffect } from 'react';
import axios from 'axios'

const PlayerListResultado = () => {

    const [jugadoresResultado, setJugadoresResultado] = useState([])
    
    useEffect(() => {
        axios.get('http://localhost:9000/resultado').then(res => {
          console.log(res.data);
          setJugadoresResultado(res.data);
        })
        .catch(err => { console.log(err) });
    }, []);

    return ( 
        <table className='table' style={{alignItems:'center',}}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Kills</th>
                    <th>Vida final</th>
                    <th>Imagen</th>
                </tr>
            </thead>
            <tbody>
                {jugadoresResultado.map(jugadorResultado =>(
                 <tr>
                    <th>{jugadorResultado.id}</th>
                    <th>{jugadorResultado.nombre}</th>
                    <th>{jugadorResultado.n_arma_actual}</th>
                    <th>{jugadorResultado.vida}</th>
                    <td>
                    <img src={jugadorResultado.img} alt="40" height="40" />
                    </td>
                  </tr>
                )
                )}
            </tbody>
        </table>
    );
}
 
export default PlayerListResultado;

   
//<img src={jugador.img} alt="40" height="40" />

//<img src={"/images/4.png"} alt="40" height="40" />