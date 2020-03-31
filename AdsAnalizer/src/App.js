import React, { Component } from 'react';

import logo from './logo.svg';
import plus from './assets/icons/plus.png';
import NavBar from './components/navBar';
import Feed from './components/feed';
import SearchBar from './components/searchBar';
import LoginForm from './components/loginForm';
import SignUpForm from './components/signUpForm';
import AddPanel from './components/AddPanel';


class App extends Component {

    
    webServerPort = 809;
    state = {

        showLogIn: false,
        showSignUp: false,
        userIsLogged: false,
        showAdd: false

    }

    constructor(props){

        super(props);

        //refs
		this.closeLogInRef = React.createRef();
        this.closeSignUpRef = React.createRef();
        this.addRef = React.createRef();
        this.closeAddRef = React.createRef();

    }

    componentDidMount(){
        this.initListeners();
    }

    initListeners(){

        this.closeLogInRef.current.addEventListener( "click", (event) => {
            if (this.closeLogInRef.current  === event.target) {
                this.showLogIn( false );
            }


        } );

        this.closeSignUpRef.current.addEventListener( "click", (event) => {
            if (this.closeSignUpRef.current  === event.target) {
                this.showSignUp( false );
            }
        } );

        this.addRef.current.addEventListener( "click", () => {
            this.showAdd( true );
        } );

        this.closeAddRef.current.addEventListener( "click", (event) => {
            if (this.closeAddRef.current  === event.target) {
                this.showAdd( false );
            }
        } );

    }

    showAdd( show ){

        this.setState({
            showAdd: show
        })

    }

    showLogIn( show ){

        this.setState({
            showLogIn: show
        } );

    }

    showSignUp( show ){

        this.setState({
            showSignUp: show
        } );

    }

    // should be available from inside loginForm and signUpForm
    doLogIn(  ){
        console.log( "made it to log in!" );
        this.showLogIn( false );
        this.setState(
             {
                 userIsLogged: true
             }
        );
    }

    doSignUp(  ){
        this.showSignUp( false );
        console.log( "made it to sign up!" )
    }

    doLogOut(){
        this.setState(
            {
                userIsLogged: false
            }
       );
    }
    render() {

        return (
            <div className={ "app" }>
                <NavBar
                        showLogIn={ this.showLogIn.bind(this) }
                        showSignUp={ this.showSignUp.bind(this) }
                        logOut= {this.doLogOut.bind(this) }
                        showLogInButton= { !this.state.userIsLogged }
                        showSignUpButton={ !this.state.userIsLogged  }
                        showLogoutButton={ this.state.userIsLogged }
                        webServerPort={ this.webServerPort }
                />
                <SearchBar
                    webServerPort={ this.webServerPort }
                />
                <Feed
                    webServerPort={ this.webServerPort }
                ></Feed>
                <div ref={ this.closeLogInRef } className={ this.state.showLogIn ? "form_wrapper show_form" : "form_wrapper" }>
                  <LoginForm  doLogIn={ this.doLogIn.bind(this)}
                            webServerPort={ this.webServerPort }>

                    </LoginForm>
                </div>
                <div ref={ this.closeSignUpRef } className={ this.state.showSignUp ? "form_wrapper show_form" : "form_wrapper" }>
                    <SignUpForm  doSignUp={ this.doSignUp.bind(this) }
                                webServerPort={ this.webServerPort }
                    ></SignUpForm>
                </div>
                <div ref={ this.closeAddRef } className={ this.state.showAdd ? "form_wrapper show_form" : "form_wrapper" }>
                    <AddPanel />
                </div>
                <div ref={ this.addRef } class={ this.state.userIsLogged ? "add_button show" : "add_button" }>
                    <img src={ plus } />
                </div>
            </div>
        )

    }


}

export default App;
