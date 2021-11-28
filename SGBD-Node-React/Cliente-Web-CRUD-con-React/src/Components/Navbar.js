import React from 'react';

const Navbar = ({brand}) => {
    return ( 
        <nav className="navbar navbar-dark bg-dark">
            <div className="container">
                <a href="http:\\localhost:3000" className="navbar-brand">{brand}</a>
            </div>
        </nav>
    );
}
 
export default Navbar;