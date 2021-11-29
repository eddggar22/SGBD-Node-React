import React from 'react';

const Navbar = ({brand}) => {
    return ( 
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">
                <a href="http:\\localhost:3000" className="navbar-brand">{brand}</a>
                <a href="http:\\localhost:3000\ranking" className="navbar-brand">Ranking jugadores</a>
            </div>
        </nav>
    );
}
 
export default Navbar;