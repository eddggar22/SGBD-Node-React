import React from 'react';

const PlayerListRanking = ({jugadores}) => {

    return ( 
        <table className='table' style={{alignItems:'center',}}>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Puntuación</th>
                </tr>
            </thead>
            <tbody>
                {jugadores.map(jugador =>(
                 <tr>
                    <th>{jugador.nom}</th>
                    <th>{jugador.puntuacio}</th>
                  </tr>
                )
                )}
            </tbody>

        </table>
    );
}
 
export default PlayerListRanking;

   
//<img src={jugador.img} alt="40" height="40" />

//<img src={"/images/4.png"} alt="40" height="40" />