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
        this.setState({ username: "",
                        phoneNumber: "",
                        email: "",
                        password: ""});
    }

    async sendData(data){
        await axios.post('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/users', data, {
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
            <form className="signup">
                <div className="title">Signup</div>
                <div className="content">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input ref={ this.refUsernameField } type="text" value={this.state.username} onChange={this.handleChange} className="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter Username"/>

                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input ref= { this.refEmailField } type="text" value={this.state.email} onChange={this.handleChange} className="form-control"   id="email" aria-describedby="emailHelp" placeholder="Enter Enter email"/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input  ref= { this.refPhoneNumberField } type="text" value={this.state.phoneNumber} onChange={this.handleChange} className="form-control"  id="phone" aria-describedby="emailHelp" placeholder="Enter Phone Number"/>

                    </div>
                    <div className="form-group">
                        <label htmlFor="pass">Password</label>
                        <input ref= { this.refPasswordField } type="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="pass" placeholder="Password"/>
                    </div>
                </div>
                <div className="interactions">
                    <button onClick= {e => {e.preventDefault();this.handleSubmit()}} className="btn btn-primary">Submit</button>
                </div>
            </form>


         );

    }



}

export default SignUpForm;
