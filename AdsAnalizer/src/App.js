import React, { Component } from 'react';

import logo from './logo.svg';
import NavBar from './components/navBar';
import Feed from './components/feed';
import SearchBar from './components/searchBar';
import LoginForm from './components/loginForm';
import SignUpForm from './components/signUpForm';



class App extends Component {


    state = {

        showLogIn: false,
        showSignUp: false,
        userIsLogged: false

    }

    constructor(props){

        super(props);

        //refs
		this.closeLogInRef = React.createRef();
        this.closeSignUpRef = React.createRef();

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

    render() {

        return (
            <div className={ "app" }>
            <NavBar showLogIn={ this.showLogIn.bind(this) } showSignUp={ this.showSignUp.bind(this) }/>
            <SearchBar/>
            <div className="container" style={{ maxWidth: "100%" }}>
              <div className="row">
                <div className="col">
                </div>
                <div className="col-8">
                  <Feed></Feed>
                </div>
                <div ref={ this.closeLogInRef } className={ this.state.showLogIn ? "form_wrapper show_form" : "form_wrapper" }>
                  <LoginForm  doLogIn={ this.doLogIn.bind(this) }></LoginForm>
                </div>
                <div ref={ this.closeSignUpRef } className={ this.state.showSignUp ? "form_wrapper show_form" : "form_wrapper" }>
                    <SignUpForm  doSignUp={ this.doSignUp.bind(this) }></SignUpForm>
                </div>
              </div>
            </div>
            </div>
        )

    }


}

export default App;
