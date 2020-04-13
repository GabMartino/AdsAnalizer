import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

class LoginForm extends Component {


    constructor(props){

        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeOnEmail = this.handleChangeOnEmail.bind(this);
        this.handleChangeOnPassword = this.handleChangeOnPassword.bind(this);
        this.sendData = this.sendData.bind(this);
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

    handleSubmit(){
        let user = {
            'email': this.state.email,
            'pass': this.state.password
        }
        this.sendData(this, user);
        this.setState({email: "",
                        password: ""});
    }

    async sendData(obj, data){
        await axios.put('http://'+window.location.hostname+':'+this.props.webServerPort+'/login', data, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }).then(function (response){
                console.log(response);
                if(response.status == 200 && response.data != "notFound"){
                       // obj.setState({userLogged: response.data});
                        const cookies = new Cookies(); 
                        let name = cookies.get("name");
                        let id = cookies.get("userId");
                        let isAdmin = cookies.get("admin");
                        let userData = {
                            _id: id,
                            name: name,
                            isAdmin: isAdmin
                        };
                       
                       obj.props.doLogIn(userData);
                }else{
                        alert("Username or Password wrong");
                }
            
          }).catch(function (error) {
                console.log(error);
          });
    }


    render() {

        return (
            <form>
                <b>Login</b>
                <div className="form-group">
                    <label for="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" value= {this.state.email} onChange={this.handleChangeOnEmail} id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" value= {this.state.password} onChange={this.handleChangeOnPassword}  id="exampleInputPassword1" placeholder="Password"/>
                </div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" for="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" onClick= {e => {e.preventDefault();this.handleSubmit()}} className="btn btn-primary">Submit</button>
            </form>


         );

    }



}

export default LoginForm;
