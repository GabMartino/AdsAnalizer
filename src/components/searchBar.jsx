import React, { Component } from 'react';
import axios from 'axios';


class SearchBar extends Component {


    state = {

        searchString: ""

    }

    constructor(props){

        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        this.setState({searchString: event.target.value});
    }

    handleSubmit(){

        //handle search
        this.sendData("Gabriele")
        console.log(this.state.searchString);

    }

    async sendData(data){

        const response = await axios.post(
            'localhost:3000/',
            { example: 'data' },
            { headers: { 'Content-Type': 'application/json' } }
          )
    }


    render() {

        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" value= {this.state.searchString} onChange={this.handleChange} type="search" placeholder="Search" aria-label="Search"/>
                            <button className="btn btn-outline-success my-2 my-sm-0" onClick={this.handleSubmit} type="submit">Search</button>
                        </form>
                </nav>
            </React.Fragment>
         );
         
    }



}

export default SearchBar;
