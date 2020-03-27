import React, { Component } from 'react';


class NavBar extends Component {

    state = {


    }

    constructor(props){

        super(props);

        //refs
		this.logInRef = React.createRef();
        this.signUpRef = React.createRef();


    }

    componentDidMount(){

        this.initListeners();

    }

    initListeners(){

        this.logInRef.current.addEventListener( "click", () => {
            this.props.showLogIn( true );
        } );

        this.signUpRef.current.addEventListener( "click", () => {
            this.props.showSignUp( true );
        } );

    }

    render() {

        return (
            <nav className="navbar navbar-light bg-light">
                <span className="navbar-brand mb-0 h1">Navbar</span>
                <p>
                    <button ref={ this.logInRef } className="btn btn-primary m-2" type="button"  aria-expanded="false" aria-controls="collapseExample">
                        Login
                    </button>
                    <button ref={ this.signUpRef } className="btn btn-primary m-2" type="button"  aria-expanded="false" aria-controls="collapseExample">
                        Signup
                    </button>

                </p>
            </nav>
         );

    }



}

export default NavBar;
