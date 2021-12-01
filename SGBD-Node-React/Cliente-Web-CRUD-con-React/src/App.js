import { React, Fragment, useState } from 'react';
import Navbar from './Components/Navbar'
import PlayerList from './Components/PlayerList'
import PlayerListResultado from './Components/PlayerListResultado'
import PlayerListRanking from './Components/PlayerListRanking'
import Form from './Components/Form'
import axios from 'axios'
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

function App() {

  const [myPlayer, setmyPlayer] = useState({
    kills: 0,
    vida: 0
  })

  async function iniciarPartida() {
    await axios.post('http://localhost:9000').then(res => {
      console.log(res)
    });
  }

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/ranking" element={
          <Fragment>
            <Navbar/>
            <PlayerListRanking />
          </Fragment>
        }>
        </Route>
        <Route path="/resultados" element={
          <Fragment>
            <Navbar />
            <div class="contenedor2">
              <h2 style={{ textAlign: 'center' }}>Resultado partida</h2>
              <PlayerListResultado/>
            </div>
          </Fragment>
        }>
        </Route>
        <Route path="/partida" element={
          <Fragment>
            <Navbar/>
            <div className="container">
              <div className="row">
                <div className="col-7" style={{ backgroundColor: 'white'}}>
                  <h2 style={{ textAlign: 'center' }}>Tabla jugadores</h2>
                  <PlayerList/>
                </div>
                <div className="col-5" style={{ backgroundColor: 'white', padding: '25px', }}>
                  <h2 style={{ textAlign: 'center' }}>Nuestro Jugador</h2>
                  <Form myPlayer={myPlayer} setmyPlayer={setmyPlayer} />
                </div>
              </div>
            </div>
          </Fragment>
        }>
        </Route>
        <Route path="/" element={
          // dos botons, un per veure la classificació i otro partida nueva
          <Fragment>
            <Navbar/>
            <div class="contenedor">
              <br></br>
              <h1>¡Bienvenido al simulador de CrossFire Fights!</h1>
              <p>Este juego esta en desarrollo, de momento puede entretenerse y probar de forma gratuita el simulador de partidas, de esta forma ayudar a los desarrolladores a recoger datos sobre el funcionamiento.</p>
              <br></br>
              <p>Todas las simulaciones quedaran registradas, y los jugadores que colaboren recibiran bonificaciones en un futuro! </p>
              <br></br>
              <div class="center">
                <Link to="/partida">
                  <button onClick={() => {
                    iniciarPartida();
                  }}>
                    Iniciar partida
                  </button>
                </Link>
              </div>
            </div>
          </Fragment>
        }>
        </Route>
      </Routes >
    </BrowserRouter >
  );
}

export default App;