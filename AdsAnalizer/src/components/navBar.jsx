import React, { Component } from 'react';


class NavBar extends Component {

    state = {
        showLogInButton: true,
        showSignUpButton: true,
        username: "",
    }

    constructor(props){

        super(props);

        //refs
		this.logInRef = React.createRef();
        this.signUpRef = React.createRef();
        this.logoutRef = React.createRef();

    }

    componentDidMount(){

        this.initListeners();

    }
    componentWillReceiveProps(props){
        this.setState({username: props.username});
    }
    initListeners(){

        this.logInRef.current.addEventListener( "click", () => {
            this.props.showLogIn( true );
        } );

        this.signUpRef.current.addEventListener( "click", () => {
            this.props.showSignUp( true );
        } );

        this.logoutRef.current.addEventListener( "click", () => {
            this.props.logOut( true );
            this.setState({username: ""});
        } );

    }

    render() {

        return (
            <nav className="navbar navbar-light">
                <span className="navbar-brand mb-0 h1">AdsAnalizer</span>
                <p>
                    {this.state.username}
                    <button ref={ this.logInRef } className={this.props.showLogInButton ? "btn btn-primary m-2" : "btn btn-primary m-2 notDisplay"}  type="button"  aria-expanded="false" aria-controls="collapseExample">
                        Login
                    </button>
                    <button ref={ this.signUpRef } className={this.props.showSignUpButton ? "btn btn-primary m-2" : "btn btn-primary m-2 notDisplay"} type="button"  aria-expanded="false" aria-controls="collapseExample">
                        Signup
                    </button>
                    <button ref={ this.logoutRef } className={this.props.showLogoutButton ? "btn btn-primary m-2" : "btn btn-primary m-2 notDisplay"} type="button"  aria-expanded="false" aria-controls="collapseExample">
                        Logout
                    </button>

                </p>
            </nav>
         );

    }



}

export default NavBar;
