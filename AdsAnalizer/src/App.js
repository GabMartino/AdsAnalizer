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
        adminInterface: false,
        userLogged: {},
        showLogIn: false,
        showSignUp: false,
        showAdd: false,
        showStatistics: false,
        userIsLogged: false,
        searchResult: null,
        filter: null,
        page: 0,
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
        this.showLogIn = this.showLogIn.bind(this);
        this.loginRequest = this.loginRequest.bind(this);
        this.logoutRequest = this.logoutRequest.bind(this);
        this.doLogin = this.doLogin.bind(this);
    }
    
    componentDidMount(){
        this.initListeners();
        //Fetch first ads
        this.fetchAds(this, {params: {pag: 0 }});

        this.doLogin(null);
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

        window.addEventListener("scroll", (event) =>{
                const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
                const body = document.body;
                const html = document.documentElement;
                const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
                const windowBottom = windowHeight + window.pageYOffset;
                //HAS TO BE IMPLEMENTED
                /*if (windowBottom <= docHeight) {
                    let searchParams = {
                        params: {
                            pag: this.state.page + 1
                        }
                    };
                    this.fetchAds(this,searchParams);
                    this.setState({ page: this.state.page + 1});
                }*/
               
            }, true);

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

        //console.log( "Filter applied: " );
        //console.log( this.state.filter );
        let searchParams = {
            params: {
                pag: 0
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
        await axios.get('http://'+this.webServerIP+':'+this.webServerPort+'/ads',params,{
            withCredentials: true,
        }).then(function (response){
                //console.log(response);
                if(response.status == 200){
                    if(params && params.page && params.page != 0 && obj.state.searchResult != null){
                        var list = obj.state.searchResult;
                        list.push(response.data);
                        obj.setState({ searchResult: list});
                    }else{
                        obj.setState({ searchResult: response.data});
                    }
                        
                            
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

    doSignUp(  ){
        this.showSignUp( false );
        //console.log( "made it to sign up!" )
    }    

    async doLogin(data){
        if(data != null){// login
            await this.loginRequest(this,data);
            this.showLogIn( false );
            return;
        }
        const cookies = new Cookies(); 
        var name = cookies.get("name");
        var id = cookies.get("userId");
        var isAdmin = cookies.get("admin");
        var phone = cookies.get("phone");
        var userData = {
            _id: id,
            name: name,
            phone: phone,
            isAdmin: isAdmin == "true"
        };
        this.showLogIn( false );
        if( id )
            this.setState({
                userIsLogged: true,
                userLogged: userData
            });

            
    }
    async loginRequest(obj, data){
        let response = null;
        await axios.put('http://'+this.webServerIP+':'+this.webServerPort+'/login', data, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }).then(function (response){
                //console.log(response);
                if(response.status == 200 && response.data != "notFound"){
                       // obj.setState({userLogged: response.data});
                        const cookies = new Cookies(); 
                        var name = cookies.get("name");
                        var id = cookies.get("userId");
                        var isAdmin = cookies.get("admin");
                        var phone = cookies.get("phone");
                        var userData = {
                            _id: id,
                            name: name,
                            phone: phone,
                            isAdmin: isAdmin == "true"
                        };
                        //console.log(userData);
                        obj.setState({
                            userIsLogged: true,
                            userLogged: userData
                        });
                        response = userData;
                }else{
                        alert("Username or Password wrong");
                }
            
          }).catch(function (error) {
                console.log(error);
          });
          return response;
        

    }

    async logoutRequest(){
        this.setState(
            {
                adminInterface: false,
                userIsLogged: false,
                userLogged: {}  
            }
        );
        this.fetchAds(this, null);
       
        await axios.put('http://'+this.webServerIP+':'+this.webServerPort+'/logout',null, {
            withCredentials: true
        }).then(function (response){
                //console.log(response);
                if(response.status == 200){
                    console.log("Logout Succeded.");
                    const cookie = new Cookies();
                    cookie.remove("sessionId");
                    cookie.remove("userId");
                    cookie.remove("name");
                    cookie.remove("admin");
                    cookie.remove("phone");
                }else{
                    alert("Something's gone wrong");
                }
            
          }).catch(function (error) {
                console.log(error);
          });
        //this.doLogin();
        
    }
    async deleteAd(adId){
        const ad = this.state.searchResult.find( ad => ad._id == adId);
        console.log(adId)
        console.log(ad)
        if(ad && (ad.advertiser.userId == this.state.userLogged._id || this.state.userLogged.isAdmin)){
            
            await axios.delete('http://'+this.webServerIP+':'+this.webServerPort+'/ads/'+adId,{
                withCredentials: true
            }).then(function (response){
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
        let searchParams = {
            params: {
                pag: 0
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
        }else if(this.state.filter == consts.FILTER_FLAGGED) {// for users
            searchParams = {
                params: {
                    rep: 1
                }
            }
        }
        this.fetchAds(this, searchParams);
    }
    async reportAd(adId, value){
        
        const ad = this.state.searchResult.find( ad => ad._id == adId);
        console.log(ad)
        if(ad){
            let params = {
                report: value
            }
            console.log(params)
            await axios.put('http://'+this.webServerIP+':'+this.webServerPort+'/ads/'+adId, params, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
                
            }).then(function (response){
                console.log(response);
                if(response.status == 200){
                        console.log("Reporting Succeded.");
                }else{
                        alert("Something's gone wrong");
                }
            
          }).catch(function (error) {
                console.error(error);
          });
        }
        this.fetchAds(this, null);
    }

    fetchSearchResult(result){
        console.log(result);
        this.setState({searchResult: result});
    }
    switchInterface(){
        this.setState({ adminInterface: !this.state.adminInterface});
    }
    render() {

        return (
            <div className={ "app" }>
                <NavBar
                        username= {this.state.userLogged.name}
                        showLogIn={ this.showLogIn.bind(this) }
                        showSignUp={ this.showSignUp.bind(this) }
                        logOut= {this.logoutRequest }
                        showAdminPanelButton = {this.state.userLogged.isAdmin}
                        switchInterface = {this.switchInterface.bind(this)}
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
                        //isAdminPanel = {this.state.userLogged.isAdmin}
                        isAdmin = {this.state.adminInterface}
                        userIsLogged={ this.state.userIsLogged } 
                        applyFilter={ this.applyFilter.bind(this) } 
                        showStatistics={ this.showStatistics.bind(this) }
                        webServerIP = {this.webServerIP}
                        webServerPort = {this.webServerPort}
                />
                <div ref={ this.closeStatistics } className={ this.state.showStatistics ? "form_wrapper show_form" : "form_wrapper" }>
                    <Statistics
                        dataset={this.state.searchResult}
                        webServerIP = {this.webServerIP}
                        webServerPort={ this.webServerPort }
                    />
                </div>
                <Feed
                    webServerIP = {this.webServerIP}
                    admin = {this.state.adminInterface}
                    userLoggedId = { this.state.userLogged._id}
                    webServerPort={ this.webServerPort }
                    adsList={ this.state.searchResult }
                    reportResult = { this.fetchSearchResult.bind(this)}
                    deleteAd = {this.deleteAd.bind(this)}
                    reportAd = {this.reportAd.bind(this)}
                ></Feed>
                <div ref={ this.closeLogInRef } className={ this.state.showLogIn ? "form_wrapper show_form" : "form_wrapper" }>
                  <LoginForm  
                            doLogin={ this.doLogin.bind(this)}
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
                <div ref={ this.closeAddRef } className={ this.state.showAdd  ? "form_wrapper show_form" : "form_wrapper" }>
                    <AddPanel   

                        actualUser= {this.state.userLogged}
                        webServerPort={this.webServerPort}
                        webServerIP = {this.webServerIP}
                        showAdd = {this.showAdd.bind(this)}
                    />
                </div>
                <div ref={ this.addRef } className={ this.state.userIsLogged && !this.state.adminInterface ? "add_button show" : "add_button" }>
                    <img src={ plus } />
                </div>
            </div>
        )

    }

    

}

export default App;
