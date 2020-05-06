import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

class LoginForm extends Component {


    constructor(props){

        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeOnEmail = this.handleChangeOnEmail.bind(this);
        this.handleChangeOnPassword = this.handleChangeOnPassword.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
    }

    state = {
        email: "",
        password: ""

    }

    handleChangeOnEmail(event) {
        this.setState({email: event.target.value});
    }

    handleChangeOnPassword(event) {
        this.setState({password: event.target.value});
    }
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    handleSubmit(){
        let user = {
            'email': this.state.email,
            'pass': this.state.password
        }
        if(user.email == "" || user.pass == ""){
            alert("Username or Password empty. Please fill the fields before Login.");
        }else{
            if(this.validateEmail(user.email)){
                this.props.doLogin(user);
                this.setState({email: "",
                                password: ""});
            }else{
                alert("The email inserted is not valid.")
            }
         
        }
       
    }


    render() {

        return (
            <form>
                <div className="title">Login</div>
                <div className="content">
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" value= {this.state.email} onChange={this.handleChangeOnEmail} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" value= {this.state.password} onChange={this.handleChangeOnPassword}  id="exampleInputPassword1" placeholder="Password"/>
                    </div>
                </div>
                <div className="interactions">
                    <button type="submit" onClick= {e => {e.preventDefault();this.handleSubmit()}} className="btn btn-primary">Go!</button>
                </div>
            </form>


         );

    }



}

export default LoginForm;
