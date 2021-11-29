import { React, Fragment, useState, useEffect } from 'react';
import Navbar from './Components/Navbar'
import PlayerList from './Components/PlayerList'
import PlayerListResultat from './Components/PlayerListResultat'
import Form from './Components/Form'
import axios from 'axios'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import { DatePicker, Button, Input, Divider, Space } from 'antd';

function App() {

  const [myPlayer, setmyPlayer] = useState({
    kills: 0,
    vida: 0
  })

  const [jugadores, setJugadores] = useState([])

  const [jugadoresSQL, setJugadores] = useState([])

  var partidaActiva = false;


  useEffect(() => {

    // const getJugadoresSQL = () => {
    //   axios.get('http://localhost:4000/info').then(res => {
    //     console.log("Peticio rebuda");
    //     console.log(res);
    //     setJugadoresSQL(res.data)
    //   })
    //     .catch(err => { console.log(err) });
    // }

    const getJugadores = () => {
          
        axios.get('http://localhost:9000/Jugador/all').then(res => {
          if (res.data[0] !== "-") {
            window.location.assign("http://localhost:3000/resultados");
            getJugadoresSQL();
          }
          var response = [];
          for (var i = 0; i < 20; i++) {
            response[i] = res.data[i + 1];
          }
          setJugadores(response)
        })
          .catch(err => { console.log(err) });
      

    }
    // getJugadoresSQL();
    setInterval(() => {
      getJugadores();
    }, 3000);
  }, [])

  async function iniciarPartida() {

    await axios.post('http://localhost:9000').then(res => {
      console.log(res)
      if (res.status == 200) {
        console.log("200 estat");
      }
    });
    partidaActiva = true;
  }

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/ranking" element={
          <Fragment>
            <Navbar brand='Batallas App' />

          </Fragment>
        }>
        </Route>
        <Route path="/resultados" element={
          <Fragment>
            <Navbar brand='Batallas App' />
            <div class="contenedor2">
              <h2 style={{ textAlign: 'center' }}>Ranking jugadores</h2>
              <PlayerListResultat jugadores={jugadores} />
            </div>
          </Fragment>
        }>
        </Route>
        <Route path="/partida" element={
          <Fragment>
            <Navbar brand='Batallas App' />
            <div className="container">
              <div className="row">
                <div className="col-7" style={{ backgroundColor: 'white'}}>
                  <h2 style={{ textAlign: 'center' }}>Tabla jugadores</h2>
                  <PlayerList jugadores={jugadores} />
                </div>
                <div className="col-5" style={{ backgroundColor: 'white', padding: '25px', }}>
                  <h2 style={{ textAlign: 'center' }}>SetPlayer</h2>
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
            <Navbar brand='Batallas App' />
            <div class="contenedor">
              <br></br>
              <h1>¡Bienvenido al simulador de CrossFire Fights!</h1>
              <p>Este juego esta en desarrollo, de momento puede entretenerse y probar de forma gratuita el simulador de partidas, para de esta forma ayudar a los desarrolladores a recoger datos sobre el funcionamiento.</p>
              <br></br>
              <p>Todas las simulaciones quedaran registradas, y los jugadores que colaboren recibiran bonificaciones en un futuro! </p>
              <br></br>
              
              <Link to="/partida">
                <button onClick={() => {
                  partidaActiva = true;
                  iniciarPartida();
                }}>
                  Iniciar partida
                </button>
                <Link to="/resultats">
                  <button class="right">
                    Ir a resultados
                  </button>
                </Link>
              </Link>
            </div>


            <Space></Space>
            <div>

            </div>

          </Fragment>
        }>
        </Route>
      </Routes >
    </BrowserRouter >
  );
}

export default App;