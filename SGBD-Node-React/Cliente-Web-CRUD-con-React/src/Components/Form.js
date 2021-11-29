import React from 'react';
import axios from 'axios';

const Form = ({ myPlayer, setmyPlayer }) => {

    const handleChange = e => {
        setmyPlayer({
            ...myPlayer,
            [e.target.name]: e.target.value
        })
    }

    let { kills, vida } = myPlayer

    const handleSubmit = e => {};

    function actualitzarKills() {
        kills = parseInt(kills, 10)
        if (kills <= 0) {
            alert('El valor introduit no es correcte')
            return
        }
        var url = 'http://localhost:9000/updatePlayerKills/' + kills;
        axios.post(url).then(() => {
            alert('S ha actualitzat el nostre jugador !');
        })
    }

    function actualitzarVida() {
        vida = parseInt(vida, 10)
        if (vida <= 0) {
            alert('El valor introduit no es correcte')
            return
        }
        var url = 'http://localhost:9000/updatePlayerVida/' + vida;
        axios.post(url).then(() => {
            alert('S ha actualitzat el nostre jugador !');
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="kills" className="form-label">Kills</label>
                <input value={kills} name="kills" onChange={handleChange} type="number" id="kills" className="form-control" />
            </div>
            <div className="mb-3">
                <label htmlFor="vida" className="form-label">vida</label>
                <input value={vida} name="vida" onChange={handleChange} type="number" id="vida" className="form-control" />
            </div>
            <div class="contenedor3">
                <button onClick={actualitzarKills}>Añadir kills </button>
                <button class="right" onClick={actualitzarVida}> Actualizar vida</button>
            </div>
        </form>
    );
}

export default Form;