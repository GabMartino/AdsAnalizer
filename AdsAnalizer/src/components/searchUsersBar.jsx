import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton, Form  } from 'react-bootstrap';

import consts from '../consts';
class SearchUsersBar extends Component {

    state = {

        minNumberValue: null,
        selectedCategory: null,
        exclusiveCat: false,
        categories: [],

    }

    constructor(props){

        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.searchField = React.createRef();
        this.checkBox = React.createRef();
        this.minNumber = React.createRef();
        this.setCategory = this.setCategory.bind(this);

        this.cleanSearchFields = this.cleanSearchFields.bind(this);

    }
    componentDidMount(){
        this.fetchData();
    }

    async fetchData(){
        axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/categories/0'
        ).then(
            (response) => {
                this.setState({categories: response.data});
                }
        );
    }

    //HANDLE CHANGING FIELDS

    handleChange(event) {
        switch(event.target){
            case this.minNumber.current:
                var value = event.target.value != '' ? event.target.value : null;
                this.setState({minNumberValue: value});
                break;
            case this.checkBox.current:
                this.setState({exclusiveCat: this.checkBox.current.checked});
        }
    }

    async setCategory(event){
        const selectedCategory = Array.isArray(this.state.categories) && this.state.categories.find(category => category._id === event.target.id);
        this.setState({ selectedCategory: selectedCategory});
    }
    //HANDLE RESEARCH
    handleSearch(){
        let searchFields = {
            params: {
                pag: 0
            }
        };

        if(this.state.selectedCategory != null){
           searchFields.params.cat = this.state.selectedCategory._id;
        }
        if(this.state.minNumberValue != null){
            searchFields.params.min = this.state.minNumberValue;
        }
        if(this.state.exclusiveCat){
            searchFields.params.mnc = 1;
        }
        this.props.fetchData(consts.USERS, searchFields);

    }
    cleanSearchFields(){
        this.setState({
            selectedCategory: null,
            minNumberValue: null,
            exclusiveCat: false,
        });
        this.minNumber.current.value = null;

    }

    render() {

        return (
            <React.Fragment>
                <nav className="navbar nav_2 navbar-expand-lg navbar-light">
                        Users
                        <form className="form-inline my-2 my-lg-0">

                            <DropdownButton id="dropdown-basic-button" className="m-2" title={this.state.selectedCategory != null ? this.state.selectedCategory.name : "Categories"}>
                            {   (Array.isArray(this.state.categories) && this.state.categories.length) ? this.state.categories.map(
                                    category =>
                                    <Dropdown.Item onClick={ this.setCategory} id={category._id} name={category.name}>{category.name}</Dropdown.Item>
                                    ) : null
                                }
                            </DropdownButton>

                            <div className="custom-control custom-checkbox">
                                <input ref= {this.checkBox} type="checkbox" className="custom-control-input" id="exclusiveCheck" checked={this.state.exclusiveCat} onChange={this.handleChange}></input>
                                <label className="custom-control-label m-2" for="exclusiveCheck">Exclusive Category</label>
                            </div>

                            <input ref={ this.minNumber } className="tiny_text form-control mr-sm-2" onChange={this.handleChange} type="search" placeholder="Min" aria-label="Search"/>

                            <button className="btn btn-primary my-2 my-sm-0 m-2" onClick={e => {e.preventDefault();this.cleanSearchFields()}} type="submit">Clear</button>
                            <button className="btn btn-outline-success my-2 my-sm-0" onClick={e => {e.preventDefault();this.handleSearch()}} type="submit">Search Users</button>
                        </form>
                </nav>
            </React.Fragment>
         );

    }



}

export default SearchUsersBar;
