import React from 'react';

const BookList = ({jugadores}) => {

    return ( 
        <table className='table'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Kills</th>
                    <th>Arma Actual</th>
                    <th>Vida</th>
                </tr>
            </thead>
            <tbody>
                {jugadores.map(jugador =>(
                 <tr>
                    <th>{jugador.id}</th>
                    <th>{jugador.nombre}</th>
                    <th>{jugador.n_arma_actual}</th>
                    <th>{jugador.key_arma_actual}</th>
                    <th>{jugador.vida}</th>
                  </tr>
                )
                )}
                
            </tbody>

        </table>
    );
}
 
export default BookList;