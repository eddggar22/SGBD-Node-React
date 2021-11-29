import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable, { Alignment } from 'react-data-table-component';

const column = [
    {
        name: 'Nombre',
        selector: 'nom',
        sortable: false
    },
    {
        name: 'Puntuación',
        selector: 'puntuacio',
        sortable: true
    }
]

class PlayerListRanking extends Component{
    state = {
        usuaris: []
    }
    componentDidMount(){
        axios.get('http://localhost:4000/info').then(response => {
            console.log(response);
            const usuaris = response.data;
            this.setState({ usuaris });
        })
        .catch(error => {
            console.log(error);
        });
    }
    render(){
        return (
            <div className="App">
                <DataTable
                    columns={column}
                    data={this.state.usuaris}
                    title="Ranking jugadores"
                />
            </div>

        );
    }
}

export default PlayerListRanking;
