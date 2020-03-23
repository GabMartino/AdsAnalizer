import React, { Component } from 'react';



class NavBar extends Component {
    state = {  }
    render() { 
        return ( 
            <nav className="navbar navbar-light bg-light">
                <span className="navbar-brand mb-0 h1">Navbar</span>
                <p>
                    <button className="btn btn-primary m-2" type="button"  aria-expanded="false" aria-controls="collapseExample">
                        Login
                    </button>
                    <button className="btn btn-primary m-2" type="button"  aria-expanded="false" aria-controls="collapseExample">
                        Signup
                    </button>
                    
                </p>
            </nav>
         );
    }
}
 
export default NavBar;