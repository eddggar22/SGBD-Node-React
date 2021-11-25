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
                )
                )}
                
            </tbody>

        </table>
    );
}
 
export default BookList;

   
//<img src={jugador.img} alt="40" height="40" />

//<img src={"/images/4.png"} alt="40" height="40" />