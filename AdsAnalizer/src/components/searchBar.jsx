import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class SearchBar extends Component {

    state = {

        searchString: "",
        minPriceValue: 0,
        maxPriceValue: Infinity,
        selectedCategory: { id: null, name:null},
        selectedRegion: { id: null, name: null},
        selectedProvince: { id: null, name: null},
        showProvinces: false,
        regions: [],
        categories: [],
        provinces: [],

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
        this.setRegion = this.setRegion.bind(this);
        this.setProvince = this.setProvince.bind(this);

    }
    componentDidMount(){
        this.fetchData();
    }

    async fetchData(){
        console.log()
        axios.get('http://'+window.location.hostname+':3001/categories').then(
            (response) => {
                this.setState({categories: response.data});
                }
        );

        axios.get('http://'+window.location.hostname+':3001/geos/',{
            params: {
                val: 0
            }
        }).then(
            (response) => {
                this.setState({regions: response.data});
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
        let prop = {...this.selectedCategory};
        prop.id = event.target.id;
        prop.name = event.target.name;
        this.setState({ selectedCategory: prop});

    }
    setProvince(event){
        let prop = {...this.state.selectedProvince};
        prop.id = event.target.id;
        prop.name = event.target.name;
        this.setState({ selectedProvince: prop });

    }
    
    setRegion(event){
        event.preventDefault();
        let prop = {...this.state.selectedRegion};
        prop.id = event.target.id;
        prop.name = event.target.name;
        this.setState({ selectedRegion: prop });

        axios.get('http://'+window.location.hostname+':3001/geos/',{
            params: {
                val: 13
            }
        }).then(
            (response) => {
                this.setState({provinces: response.data});
                }
        );
        this.setState({ showProvinces: true });
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
                            <DropdownButton id="dropdown-basic-button" className="m-2" title={this.state.selectedCategory.name ? this.state.selectedCategory.name : "Categories"}>
                            {   this.state.categories.map(
                                    category =>
                                    <Dropdown.Item onClick={ this.setCategory} id={category._id} name={category.name}>{category.name}</Dropdown.Item> 
                                    )
                                }
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" className="m-2" title={this.state.selectedRegion.name ? this.state.selectedRegion.name : "Regions"}>
                            {   this.state.regions.map(
                                    region =>
                                    <Dropdown.Item onClick={ e => this.setRegion(e) } id={region._id} name={region.name}>{region.name}</Dropdown.Item> 
                                    )
                                }
                            </DropdownButton> 
                            <DropdownButton id="dropdown-basic-button" className={this.state.showProvinces ? "m-2" : "notDisplay" } title={this.state.selectedProvince.name ? this.state.selectedProvince.name : "Provinces"} >
                            {   this.state.provinces.map(
                                    province =>
                                    <Dropdown.Item onClick={ this.setProvince } id={province._id} name={province.name}>{province.name} </Dropdown.Item> 
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
