import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class SearchBar extends Component {

    state = {

        searchString: "",
        minPriceValue: 0,
        maxPriceValue: Infinity,
        selectedCategory: null,
        categories: []

    }

    constructor(props){

        super(props);

        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.minPriceField = React.createRef();
        this.maxPriceField = React.createRef();
        this.searchField = React.createRef();
        this.setCategory = this.setCategory.bind(this);

    }
    componentDidMount(){
        this.fetchData();
    }

    async fetchData(){
        axios.get('http://127.0.0.1:3001/categories').then(
            (response) => {
                this.setState({categories: response.data});
                }
        );
    }

    //HANDLE CHANGING FIELDS

    handleChange(event) {
        switch(event.target){
            case this.searchField:
                this.setState({searchString: event.target.value});
                break;
            case this.minPriceField:
                this.setState({minPriceValue: event.target.value});
                break;
            case this.maxPriceField:
                this.setState({maxPriceValue: event.target.value});
                
        }
    }

    setCategory(event){
        this.setState({ selectedCategory: event.target.id });

    }

    //HANDLE RESEARCH
    handleSearch(){

        let linearizedResearchFields = "?[src="+this.state.searchString+"]"+ 
                                        "[&cat="+this.state.selectedCategory+"]"+
                                        "[&geo="+this.state.selectedGeo+"]"+
                                        "[&min="+this.state.minPriceValue+"]"+
                                        "[&max="+this.state.maxPriceValue+"]";
        console.log(linearizedResearchFields);
        this.sendData(linearizedResearchFields);
    }

    async sendData(linearizedResearchFields){
        axios.get('http://127.0.0.1:3001/categories'+ linearizedResearchFields).then(
            (response) => {
                this.setState({categories: response.data});
                console.log("oooooooook");
                }
        );
    }


    render() {

        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <form className="form-inline my-2 my-lg-0">
                            <input ref={ this.searchField } className="form-control mr-sm-2" onChange={this.handleChange} type="search" placeholder="Search" aria-label="Search"/>
                            <DropdownButton id="dropdown-basic-button" className="m-2" title="Categories">
                            { this.state.categories.map(
                                    category =>
                                    <Dropdown.Item onClick={ this.setCategory} id={category._id} >{category.name}</Dropdown.Item> 
                                    )
                                }
                            </DropdownButton>
                            <input ref={ this.minPriceField } className="form-control mr-sm-2" onChange={this.handleChange} type="search" placeholder="Min" aria-label="Search"/>
                            <input ref={ this.maxPriceField } className="form-control mr-sm-2" onChange={this.handleChange} type="search" placeholder="Max" aria-label="Search"/>
                            <button className="btn btn-outline-success my-2 my-sm-0" onClick={this.handleSearch} type="submit">Search</button>
                        </form>
                </nav>
            </React.Fragment>
         );
         
    }



}

export default SearchBar;
