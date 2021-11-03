import React, {Fragment, useState, useEffect} from 'react';
import Navbar from './Components/Navbar'
import BookList from './Components/BookList'
import Form from './Components/Form'
import axios from 'axios'

function App() {

  const [book, setBook] = useState({
    titulo: '',
    autor: '',
    edicion: 0
  })

  const [jugadores, setJugadores] = useState([])

  //const [listUpdated, setListUpdated] = useState(false)

  /*useEffect (() => {
    const getJugadores = () =>{
    // fetch('http://localhost:9000/Jugador/1').then(res=>res.json()).then(res =>setJugadores(res))
    axios.get('http://localhost:9000/Jugador/all').then(res=>{console.log(res)
    setJugadores(res.data)
    })
     .catch(err => {console.log(err)})
    }
    getJugadores()
   }, [])*/

   useEffect (() => {
      setInterval(() => {
        const getJugadores = () =>{
        // fetch('http://localhost:9000/Jugador/1').then(res=>res.json()).then(res =>setJugadores(res))
        axios.get('http://localhost:9000/Jugador/all').then(res=>{console.log(res)
        setJugadores(res.data)
        })
        .catch(err => {console.log(err)})
        }
        getJugadores()
      }, 5000);
   }, [])

   
   

  return (
    <Fragment>
      <Navbar brand='Batallas App'/>
      <div className="container">
        <div className="row">
          <div className="col-7">
            <h2 style={{textAlign: 'center'}}>Tabla jugadores</h2>
            <BookList jugadores={jugadores}/>
          </div>
          <div className="col-5">
            <h2 style={{textAlign: 'center'}}>Book Form</h2>
            <Form book={book} setBook={setBook}/>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;

/*          <div className="col-5">
            <h2 style={{textAlign: 'center'}}>Book Form</h2>
            <Form book={book} setBook={setBook}/>
          </div>*/
