import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';


const column = [
  {
    name: 'alias',
    selector: 'alias',
    sortable: true
  },
  {
    name: 'nom',
    selector: 'nom',
    sortable: true
  }
]
class App extends Component{

state ={
  usuaris: []
}
  componentDidMount(){
    axios.get('http://localhost:4000/info').then(response=>{
      console.log(response);
     const usuaris = response.data;
     this.setState({usuaris});
    })
    .catch(error=>{
      console.log(error);
    });
  }
  render(){
    return(
      <div className="App">
        <DataTable
          columns={column}
          data={this.state.usuaris}
          title="Resultats"
        />
    </div>
    
    );
  }
}

export default App;
