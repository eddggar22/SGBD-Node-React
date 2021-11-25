import React from 'react';
import axios from 'axios';

const Form = ({myPlayer, setmyPlayer}) => {

    const handleChange = e => {
        setmyPlayer({
            ...myPlayer,
            [e.target.name]: e.target.value
        })
    }

    let{kills, vida} = myPlayer

    /*const handleSubmit = e => {

        kills = parseInt(kills, 10)
        vida = parseInt(vida, 10)
        //validación de los datos

        if ( kills <= 0  || vida <= 0 ) {
            alert('Todos los campos son obligatorios')
            return
        }

        //consulta
        const requestInit = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(myPlayer)
        }
        fetch('http://localhost:9000/updatePlayer', requestInit)
        .then(res => res.text())
        .then(res => console.log(res))

       
        setmyPlayer({
            kills:0,
            vida: 0
        })

    }*/

    const handleSubmit = e => {
/*
        e.preventDefault();

        kills = parseInt(kills, 10)
        vida = parseInt(vida, 10)
        //validación de los datos

        if ( kills <= 0  || vida <= 0 ) {
            alert('Todos los campos son obligatorios')
            return
        }
    
        const myPlayer = {
          kills,
          vida,
        };

        var url = 'http://localhost:9000/updatePlayerKills/' + kills;
        axios.post(url).then(() => {

            console.log('Peticion POST realizada')
        })
        */
      };

      function actualitzarKills() {

        kills = parseInt(kills, 10)

        if ( kills <= 0 ) {
            alert('El valor introduit no es correcte')
            return
        }

        var url = 'http://localhost:9000/updatePlayerKills/' + kills;
        axios.post(url).then(() => {

            //console.log('Peticion POST realizada')

            alert('S ha actualitzat el nostre jugador !');
        })

        
      }

      function actualitzarVida() {

        vida = parseInt(vida, 10)

        if ( vida <= 0 ) {
            alert('El valor introduit no es correcte')
            return
        }

        var url = 'http://localhost:9000/updatePlayerVida/' + vida;
        axios.post(url).then(() => {

            //console.log('Peticion POST realizada')

            alert('S ha actualitzat el nostre jugador !');
        })
        
      }

    return ( 
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="kills" className="form-label">Kills</label>
                <input value={kills}  name="kills" onChange={handleChange} type="number" id="kills" className="form-control"/>
            </div>
            <div className="mb-3">
                <label htmlFor="vida" className="form-label">vida</label>
                <input value={vida}  name="vida" onChange={handleChange} type="number" id="vida" className="form-control"/>
            </div>
            
            <button onClick={actualitzarKills}>Afegir Kills </button>
            <button onClick={actualitzarVida}> Actualitzar vida</button>
        </form>
    );
}
 
export default Form;

//<button type="submit" className="btn btn-primary">Actualitzar</button>