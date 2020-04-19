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
    webServerIP = window.location.hostname;
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
        this.deleteAd = this.deleteAd.bind(this);
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
                isAdmin: isAdmin == "true"
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
        let searchParams = {
            params: {
                pag: 1
            }
        };
        if(this.state.filter == consts.FILTER_MY_ADS){//for ads of a user
            searchParams = {
                params: {
                    uid: this.state.userLogged._id
                }
            }
        }else if(this.state.filter == consts.FILTER_FLAGGED) {// for reported ads
            searchParams = {
                params: {
                    rep: 1
                }
            }
        }

        this.fetchAds(this, searchParams);
        

    }
    async fetchAds(obj,params){
        await axios.get('http://'+this.webServerIP+':'+this.webServerPort+'/ads',params).then(function (response){
                console.log(response);
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
        await axios.put('http://'+this.webServerIP+':'+this.webServerPort+'/logout').then(function (response){
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
    async deleteAd(adId){
        console.log(adId);
        console.log(adId);
        const ad = this.state.searchResult.find( ad => ad._id == adId);
        console.log(ad);
        if(ad && ad.advertiser.userId == this.state.userLogged._id){
            console.log("cancellazione");
            await axios.delete('http://'+this.webServerIP+':'+this.webServerPort+'/ads/'+adId).then(function (response){
                console.log(response);
                if(response.status == 200){
                        console.log("Delete Succeded.");
                }else{
                        alert("Something's gone wrong");
                }
            
          }).catch(function (error) {
              console.error(error);
           
            });
        }
    
    }
    async reportAd(adId){
        
        const ad = this.state.searchResult.find( ad => ad._id == adId);
        console.log(ad);
        if(ad){
            let params = {
                report: true
            }
            await axios.put('http://'+this.webServerIP+':'+this.webServerPort+'/ads/'+adId, params, {
                headers: { 'Content-Type': 'application/json' }
                
            }).then(function (response){
                console.log(response);
                if(response.status == 200){
                        console.log("Reporting Succeded.");
                }else{
                        alert("Something's gone wrong");
                }
            
          }).catch(function (error) {
            if (error.response) {
                /*
                 * The request was made and the server responded with a
                 * status code that falls out of the range of 2xx
                 */
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                /*
                 * The request was made but no response was received, `error.request`
                 * is an instance of XMLHttpRequest in the browser and an instance
                 * of http.ClientRequest in Node.js
                 */
                console.log(error.request);
            } else {
                // Something happened in setting up the request and triggered an Error
                console.log('Error', error.message);
            }
          });
        }
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
                    webServerIP = {this.webServerIP}
                    webServerPort={ this.webServerPort }
                    reportResult = { this.fetchSearchResult.bind(this)}
                />
                <Dashboard 
                        isAdmin = {this.state.userLogged.isAdmin}
                        userIsLogged={ this.state.userIsLogged } 
                        applyFilter={ this.applyFilter.bind(this) } 
                        showStatistics={ this.showStatistics.bind(this) }
                />
                <div ref={ this.closeStatistics } className={ this.state.showStatistics ? "form_wrapper show_form" : "form_wrapper" }>
                    <Statistics
                        dataset={this.state.searchResult}
                    
                    />
                </div>
                <Feed
                    webServerIP = {this.webServerIP}
                    admin = {this.state.userLogged.isAdmin}
                    userLoggedId = { this.state.userLogged._id}
                    webServerPort={ this.webServerPort }
                    adsList={ this.state.searchResult }
                    reportResult = { this.fetchSearchResult.bind(this)}
                    deleteAd = {this.deleteAd.bind(this)}
                    reportAd = {this.reportAd.bind(this)}
                ></Feed>
                <div ref={ this.closeLogInRef } className={ this.state.showLogIn ? "form_wrapper show_form" : "form_wrapper" }>
                  <LoginForm  doLogIn={ this.doLogIn.bind(this)}
                            webServerPort={ this.webServerPort }
                            webServerIP = {this.webServerIP}
                        >
                                
                    </LoginForm>
                </div>
                <div ref={ this.closeSignUpRef } className={ this.state.showSignUp ? "form_wrapper show_form" : "form_wrapper" }>
                    <SignUpForm  doSignUp={ this.doSignUp.bind(this) }
                                webServerPort={ this.webServerPort }
                                webServerIP = {this.webServerIP}
                    ></SignUpForm>
                </div>
                <div ref={ this.closeAddRef } className={ this.state.showAdd ? "form_wrapper show_form" : "form_wrapper" }>
                    <AddPanel
                        actualUser= {this.state.userLogged}
                        webServerPort={this.webServerPort}
                        webServerIP = {this.webServerIP}
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
