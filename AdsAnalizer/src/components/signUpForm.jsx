import React, { Component } from 'react';
import axios from 'axios';

class SignUpForm extends Component {

    state = {
        username: "",
        phoneNumber: "",
        email: "",
        password: ""
     }

    constructor(props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.refUsernameField = React.createRef();
        this.refPhoneNumberField = React.createRef();
        this.refEmailField = React.createRef();
        this.refPasswordField = React.createRef();
    }

    handleChange(event) {
        switch(event.target){
            case this.refUsernameField.current:
                this.setState({username: event.target.value});
                break;
            case this.refPhoneNumberField.current:
                this.setState({phoneNumber: event.target.value});
                break;
            case this.refEmailField.current:
                this.setState({email: event.target.value});
                break;
            case this.refPasswordField.current:
                this.setState({password: event.target.value});
            
        }
    }
    handleSubmit(){

        let newUser = {
            "name": this.state.username,
            "phone": this.state.phoneNumber,
            "email": this.state.email,
            "pass": this.state.password
        }
        this.sendData(newUser);
    }

    async sendData(data){
        await axios.post('http://'+window.location.hostname+':'+this.props.webServerPort+'/users', data, {
            headers: { 'Content-Type': 'application/json' },
          }).then((response) =>{
              console.log(response)
              if(response.data == "ok"){
                  this.props.doSignUp();
              }
          })
    }


    render() {

        return (
            <form>
                <b>Signup</b>
                <div className="form-group">
                    <label for="username">Username</label>
                    <input ref={ this.refUsernameField } type="text" value={this.state.username} onChange={this.handleChange} className="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter Username"/>
                    
                </div>
                <div className="form-group">
                    <label for="email">Email address</label>
                    <input ref= { this.refEmailField } type="text" value={this.state.email} onChange={this.handleChange} className="form-control"   id="email" aria-describedby="emailHelp" placeholder="Enter Enter email"/>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label for="phone">Phone Number</label>
                    <input  ref= { this.refPhoneNumberField } type="text" value={this.state.phoneNumber} onChange={this.handleChange} className="form-control"  id="phone" aria-describedby="emailHelp" placeholder="Enter Phone Number"/>
                   
                </div>
                <div className="form-group">
                    <label for="pass">Password</label>
                    <input ref= { this.refPasswordField } type="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="pass" placeholder="Password"/>
                </div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" for="exampleCheck1">Check me out</label>
                </div>
                <button onClick= {e => {e.preventDefault();this.handleSubmit()}} className="btn btn-primary">Submit</button>
            </form>


         );

    }



}

export default SignUpForm;
