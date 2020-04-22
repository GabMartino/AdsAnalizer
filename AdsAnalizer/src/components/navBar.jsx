import React, { Component } from 'react';


class NavBar extends Component {

    state = {
        showLogInButton: true,
        showSignUpButton: true,
        username: "",
        AdminPanelButtonClicked: false
    }

    constructor(props){

        super(props);

        //refs
		this.logInRef = React.createRef();
        this.signUpRef = React.createRef();
        this.logoutRef = React.createRef();
        this.adminPanelRef = React.createRef();

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
            this.props.logOut();
            this.setState({username: ""});
        } );
        this.adminPanelRef.current.addEventListener( "click", () => {
            this.props.switchInterface();
            this.setState({ AdminPanelButtonClicked: !this.state.AdminPanelButtonClicked });
        } );

    }

    render() {

        return (
            <nav className="navbar navbar-light">
                <div className="nav_elem navbar-brand mb-0 h1">AdsAnalizer</div>
                <div className="nav_elem">
                    <div className={ this.state.username ? "user_info show" : "user_info" }>
                        <p className="label">LOGGED AS</p>
                        <p>{this.state.username}</p>
                    </div>
                    <button ref={ this.adminPanelRef } className={this.props.showAdminPanelButton ? "btn btn-primary m-2" : "btn btn-primary m-2 notDisplay"}  type="button"  aria-expanded="false" aria-controls="collapseExample">
                        {!this.state.AdminPanelButtonClicked ? "Show Admin Panel" : "Show User Panel"}
                    </button>
                    <button ref={ this.logInRef } className={this.props.showLogInButton ? "btn btn-primary m-2" : "btn btn-primary m-2 notDisplay"}  type="button"  aria-expanded="false" aria-controls="collapseExample">
                        Login
                    </button>
                    <button ref={ this.signUpRef } className={this.props.showSignUpButton ? "btn btn-primary m-2" : "btn btn-primary m-2 notDisplay"} type="button"  aria-expanded="false" aria-controls="collapseExample">
                        Signup
                    </button>
                    <button ref={ this.logoutRef } className={this.props.showLogoutButton ? "btn btn-primary m-2" : "btn btn-primary m-2 notDisplay"} type="button"  aria-expanded="false" aria-controls="collapseExample">
                        Logout
                    </button>

                </div>
            </nav>
         );

    }



}

export default NavBar;
