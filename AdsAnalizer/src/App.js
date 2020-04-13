import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import logo from './logo.svg';
import plus from './assets/icons/plus.png';
import NavBar from './components/navBar';
import Feed from './components/feed';
import SearchBar from './components/searchBar';
import LoginForm from './components/loginForm';
import SignUpForm from './components/signUpForm';
import AddPanel from './components/AddPanel';
import Dashboard from './components/dashboard';
import Statistics from './components/Statistics';
import consts from './consts';



class App extends Component {


    webServerPort = 8080;
    state = {
        userLogged: {},
        showLogIn: false,
        showSignUp: false,
        showAdd: false,
        showStatistics: false,
        userIsLogged: false,
        searchResult: null,
        filter: null,
    }

    constructor(props){

        super(props);

        //refs
		this.closeLogInRef = React.createRef();
        this.closeSignUpRef = React.createRef();
        this.closeAddRef = React.createRef();
        this.closeStatistics = React.createRef();
        this.addRef = React.createRef();
        this.fetchAds = this.fetchAds.bind(this);

    }

    componentDidMount(){
        this.initListeners();
        var params = {
            params: {
                pag: 1
            }
        };
        this.fetchAds(this, params);
        const cookies = new Cookies(); 
        let name = cookies.get("name");
        let id = cookies.get("userId");
        let isAdmin = cookies.get("admin");
        if(name != undefined && id != undefined){
            let userData = {
                _id: id,
                name: name,
                isAdmin: isAdmin
            };
            this.doLogIn(userData);
        }
       
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

        this.closeStatistics.current.addEventListener( "click", (event) => {
            if (this.closeStatistics.current  === event.target) {
                this.showStatistics( false );
            }
        } );

    }

    applyFilter( filter ){

        if( this.state.filter == filter ){

            this.setState( {
                filter: !this.state.filter
            } );

        } else{

            this.setState( {
                filter: filter
            } );

        }

        console.log( "Filter applied: " );
        console.log( this.state.filter );
        var params = {
            params: {
                pag: 1
            }
        };
        if(this.state.filter == consts.FILTER_MY_ADS){//for ads of a user
            params = {
                params: {
                    uid: this.state.userLogged.id
                }
            }
        }else if(this.state.filter == consts.FILTER_FLAGGED) {// for reported ads
            params = {
                params: {
                    rep: 1
                }
            }
        }

        this.fetchAds(this, params);
        

    }
    async fetchAds(obj,params){
        await axios.get('http://'+window.location.hostname+':'+this.webServerPort+'/ads',params).then(function (response){
                //console.log(response);
                if(response.status == 200){
                    obj.setState({ searchResult: response.data});
                    console.log("oook");
                }else{
                    alert("Something's gone wrong");
                }
            
          }).catch(function (error) {
                console.error(error);
          });
    }

    showStatistics( show ){

        this.setState({
            showStatistics: show
        })

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
    doLogIn(userData){
        console.log( "made it to log in!" );
        this.showLogIn( false );
        this.setState(
             {
                 userIsLogged: true,
                 userLogged: userData
             }
        );
        //const cookie = new Cookies();
        //console.log(cookie.get("sessionId"));
    }

    doSignUp(  ){
        this.showSignUp( false );
        console.log( "made it to sign up!" )
    }

    doLogOut(){
        this.setState(
            {
                userIsLogged: false,
                userLogged: {}  
            }
       );
       this.logoutRequest();
       this.fetchAds(this, null);
       const cookie = new Cookies();
       console.log(cookie.remove("sessionId"));
       console.log(cookie.remove("userId"));
       console.log(cookie.remove("name"));
       console.log(cookie.remove("admin"));
    }

    async logoutRequest(obj, data){
        await axios.put('http://'+window.location.hostname+':'+this.webServerPort+'/logout').then(function (response){
                console.log(response);
                if(response.status == 200){
                        console.log("Logout Succeded.");
                }else{
                        alert("Something's gone wrong");
                }
            
          }).catch(function (error) {
                console.log(error);
          });
    }
    
    fetchSearchResult(result){
        console.log(result);
        this.setState({searchResult: result});
    }
    render() {

        return (
            <div className={ "app" }>
                <NavBar
                        username= {this.state.userLogged.name}
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
                    reportResult = { this.fetchSearchResult.bind(this)}
                />
                <Dashboard 
                        userIsLogged={ this.state.userIsLogged } 
                        applyFilter={ this.applyFilter.bind(this) } 
                        showStatistics={ this.showStatistics.bind(this) }/>
                <div ref={ this.closeStatistics } className={ this.state.showStatistics ? "form_wrapper show_form" : "form_wrapper" }>
                    <Statistics
                        dataset={this.state.searchResult}
                    
                    />
                </div>
                <Feed
                    webServerPort={ this.webServerPort }
                    adsList={ this.state.searchResult }
                    reportResult = { this.fetchSearchResult.bind(this)}
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
                    <AddPanel
                        actualUser= {this.state.userLogged}
                        webServerPort={this.webServerPort}
                        showAdd = {this.showAdd.bind(this)}
                    />
                </div>
                <div ref={ this.addRef } class={ this.state.userIsLogged ? "add_button show" : "add_button" }>
                    <img src={ plus } />
                </div>
            </div>
        )

    }

    

}

export default App;
