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
import SearchUsersBar from './components/searchUsersBar';
import consts from './consts';



class App extends Component {


    webServerPort = 8080;
    webServerIP = window.location.hostname;
    //webServerPort = 8080;
    //webServerIP = window.location.hostname;
    state = {
        adminInterface: false,
        userLogged: {},
        showLogIn: false,
        showSignUp: false,
        showAdd: false,
        showStatistics: false,
        userIsLogged: false,
        searchResult: null,
        LastKindOfResult: consts.ADS,
        filter: null,
        lastSearchParams: null,
        reportedAdInSession: []

    }

    constructor(props){

        super(props);

        //refs
		this.closeLogInRef = React.createRef();
        this.closeSignUpRef = React.createRef();
        this.closeAddRef = React.createRef();
        this.closeStatistics = React.createRef();
        this.addRef = React.createRef();
        this.fetchData = this.fetchData.bind(this);
        this.deleteAd = this.deleteAd.bind(this);
        this.showLogIn = this.showLogIn.bind(this);
        this.loginRequest = this.loginRequest.bind(this);
        this.logoutRequest = this.logoutRequest.bind(this);
        this.doLogin = this.doLogin.bind(this);
    }

    componentDidMount(){
        this.initListeners();
        //Fetch first ads
        let searchParams = {
            params: {
                pag: 0
            }
        };
        this.fetchData(consts.ADS, searchParams);

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
                if (Math.round(windowBottom - 1 ) >=  docHeight || Math.round(windowBottom) >=  docHeight ) {

                    let searchParams = this.state.lastSearchParams;
                    searchParams.params.pag += 1;

                    this.fetchData(this.state.LastKindOfResult, searchParams);
                    this.setState({ lastSearchParams: searchParams});

                }

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
        let searchParams = {
            params: {
                pag: 0
            }
        };
        let kindOfData = consts.ADS;
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
        }else if(this.state.filter == consts.FILTER_USERS) {// for reported ads
            kindOfData = consts.USERS;
        }

        this.fetchData(kindOfData, searchParams);


    }
    async fetchData(kindOfData, params){
        let restAddress = "";
        if(kindOfData == consts.ADS){
            restAddress = '/ads';
        }else if( kindOfData == consts.USERS){
            restAddress = '/stats/users';
        }
        this.setState({lastSearchParams: params});

        await axios.get('http://'+this.webServerIP+':'+this.webServerPort+restAddress,params,{
            withCredentials: true,
        }).then((response) =>{
                if(response.status == 200){
                    if(params && params.params.pag && params.params.pag > 0 && kindOfData == this.state.LastKindOfResult && this.state.searchResult){

                        this.setState({ searchResult: this.state.searchResult.concat(response.data)});
                    }else{
                        this.setState({ searchResult: response.data,
                                        LastKindOfResult: kindOfData});
                    }


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
                if(response.status == 200 ){
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
                alert("Username or Password not valid.");
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
        this.fetchData(consts.ADS, null);

        await axios.put('http://'+this.webServerIP+':'+this.webServerPort+'/logout',null, {
            withCredentials: true
        }).then(function (response){
                //console.log(response);
                if(response.status == 200){
                    console.log("Logout Succeded.");

                }else{
                    alert("Something's gone wrong");
                }

          }).catch(function (error) {
                console.log(error);
          }).finally(() =>{
            const cookie = new Cookies();
            cookie.remove("sessionId");
            cookie.remove("userId");
            cookie.remove("name");
            cookie.remove("admin");
            cookie.remove("phone");
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
        this.fetchData(consts.ADS, searchParams);
    }
    async reportAd(adId, value){
        if( !this.state.reportedAdInSession.includes(adId) || !value){
            const ad = this.state.searchResult.find( ad => ad._id == adId);

            if(ad){
                let params = {
                    report: value
                }

                await axios.put('http://'+this.webServerIP+':'+this.webServerPort+'/ads/'+adId, params, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true

                }).then((response) =>{
                    console.log(response);
                    if(response.status == 200){
                        let reportedAdInSession = this.state.reportedAdInSession;
                        reportedAdInSession.push(adId);
                        this.setState({ reportedAdInSession:reportedAdInSession });
                        console.log("Reporting Succeded.");
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
            this.fetchData(consts.ADS, searchParams);
        }else{
            alert("You've already reported this ad");
        }

    }

    switchInterface(){
        this.setState({ adminInterface: !this.state.adminInterface});
        if(!this.state.adminInterface){
            this.fetchData(consts.ADS, null);
        }
        this.setState({clearDashboard: true });
        this.setState({clearDashboard: false });
        this.setState({filter: null});
    }
    render() {

        return (
            <div className={ this.state.adminInterface ? "app admin_mode" : "app" }>
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
                    fetchData = {this.fetchData }

                />
                <div className={ this.state.userIsLogged && this.state.adminInterface ? "user_bar" : "notDisplay" }>
                    <SearchUsersBar
                        webServerIP = {this.webServerIP}
                        webServerPort={ this.webServerPort }
                        fetchData = {this.fetchData }

                    />
                </div>


                <Dashboard
                        clearDashboardSignal = { this.state.clearDashboard}
                        //isAdminPanel = {this.state.userLogged.isAdmin}
                        isAdmin = {this.state.adminInterface}
                        userIsLogged={ this.state.userIsLogged }
                        applyFilter={ this.applyFilter.bind(this) }
                        showStatistics={ this.showStatistics.bind(this) }
                        webServerIP = {this.webServerIP}
                        webServerPort = {this.webServerPort}
                />
                <div ref={ this.closeStatistics } className={ this.state.showStatistics ? "form_wrapper show_form stat" : "form_wrapper" }>
                    <Statistics
                        dataset={this.state.searchResult}
                        webServerIP = {this.webServerIP}
                        webServerPort={ this.webServerPort }

                    />
                </div>
                <div className="content_label">
                    <p className="content_label">
                        {this.state.LastKindOfResult == consts.ADS ? (this.state.filter == "filter_flagged" ? "Flagged Ads:" : (this.state.filter == "filter_my_ads" ? "My Ads:": "Ads:"))  : "Users:"}
                    </p>
                </div>
                <Feed
                    kindOfResult = {this.state.LastKindOfResult}
                    webServerIP = {this.webServerIP}
                    admin = {this.state.adminInterface}
                    userLoggedId = { this.state.userLogged._id}
                    webServerPort={ this.webServerPort }
                    data={ this.state.searchResult }
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
