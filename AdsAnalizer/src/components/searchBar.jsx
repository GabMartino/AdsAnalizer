import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class SearchBar extends Component {

    state = {

        searchString: null,
        minPriceValue: null,
        maxPriceValue: null,
        selectedCategory: { id: null, name:null},
        selectedSubCategory: {id: null, name:null},
        selectedRegion: { id: null, name: null},
        selectedProvince: { id: null, name: null},
        showProvinces: false,
        showSubCategories: false,
        regions: [],
        categories: [],
        subcategories: [],
        provinces: [],
        searchResult: null

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
        this.setSubCategory = this.setSubCategory.bind(this);
        this.setRegion = this.setRegion.bind(this);
        this.setProvince = this.setProvince.bind(this);

    }
    componentDidMount(){
        this.fetchData();
    }

    async fetchData(){
        axios.get('http://'+window.location.hostname+':'+this.props.webServerPort+'/categories/0'
        ).then(
            (response) => {
                console.log("Fetching all categories for the first time");
                console.log(response.data);
                this.setState({categories: response.data});
                }
        );

        axios.get('http://'+window.location.hostname+':'+this.props.webServerPort+'/geos/0').then(
            (response) => {
                console.log("Fetching all geos for the first time");
                console.log(response.data);
                this.setState({regions: response.data});
                }
        );
    }

    //HANDLE CHANGING FIELDS

    handleChange(event) {
        switch(event.target){
            case this.searchField.current:
                this.setState({searchString: event.target.value});
                break;
            case this.minPriceField.current:
                var value = event.target.value != '' ? event.target.value : 0;
                this.setState({minPriceValue: value});
                break;
            case this.maxPriceField.current:
                var value = event.target.value != '' ? event.target.value : Infinity;
                this.setState({maxPriceValue: value});
        }
    }

    async setCategory(event){
        let prop = {...this.selectedCategory};
        prop.id = event.target.id;
        prop.name = event.target.name;
        this.setState({ selectedCategory: prop});
        this.setState({ selectedSubCategory: { id: null, name: null} });
        //console.log(window.location.hostname);
        await axios.get('http://'+window.location.hostname+':'+this.props.webServerPort+'/categories/'+prop.id).then(
            (response) => {
                this.setState({subcategories: response.data});
                
                }
        );
        this.setState({ showSubCategories: true });
    }
    setSubCategory(event){
        let prop = {...this.state.selectedSubCategory};
        prop.id = event.target.id;
        prop.name = event.target.name;
        this.setState({ selectedSubCategory: prop });

    }

    async setRegion(event){
        event.preventDefault();
        let prop = {...this.state.selectedRegion};
        prop.id = event.target.id;
        prop.name = event.target.name;
       
        this.setState({selectedRegion: prop });
        this.setState({selectedProvince: { id: null, name: null} });
        //console.log(window.location.hostname);
        await axios.get('http://'+window.location.hostname+':'+this.props.webServerPort+'/geos/'+prop.id).then(
            (response) => {
                this.setState({provinces: response.data});
                
                }
        );
        this.setState({ showProvinces: true });

    }
    setProvince(event){
        let prop = {...this.state.selectedProvince};
        prop.id = event.target.id;
        prop.name = event.target.name;
        this.setState({ selectedProvince: prop });

    }

    //HANDLE RESEARCH
    handleSearch(){
        let searchFields = "?";
        let searchFields2 = {
            params: {

            }
        };
        if(this.state.searchString != null && this.state.searchString != ''){
            searchFields += "[src=" + this.state.searchString + "]";
            searchFields2.params.src = this.state.searchString;
        }
        if(this.state.selectedSubCategory.id != null){
            searchFields += "[&cat=" + this.state.selectedSubCategory.id + "]";
            searchFields2.params.cat = this.state.selectedSubCategory.id;
        }else if(this.state.selectedCategory.id != null){
           searchFields += "[&cat=" + this.state.selectedCategory.id + "]";
           searchFields2.params.cat = this.state.selectedCategory.id;
        }
        if(this.state.selectedRegion.id != null){
            searchFields += "[&geo=" + this.state.selectedRegion.id + "]";
            searchFields2.params.geo = this.state.selectedRegion.id;
        }
        if(this.state.maxPriceValue != null){
            searchFields += "[&max=" + this.state.maxPriceValue + "]";
            searchFields2.params.max = this.state.maxPriceValue;
        }
        if(searchFields === "?")
            searchFields = "";
        console.log(searchFields);
        this.sendData(searchFields2);
       
    }

    async sendData(searchFields){
        await axios.get('http://'+window.location.hostname+':'+this.props.webServerPort+'/ads', searchFields).then(
            (response) => {
                    this.setState({searchResult: response.data});
                    console.log(response.data);
                    this.props.reportResult(this.state.searchResult);
                }
        );
    }


    render() {

        return (
            <React.Fragment>
                <nav className="navbar nav_2 navbar-expand-lg navbar-light">
                        <form className="form-inline my-2 my-lg-0">
                            <input ref={ this.searchField } className="form-control mr-sm-2" onChange={this.handleChange} type="search" placeholder="Search" aria-label="Search"/>
                            <DropdownButton id="dropdown-basic-button" className="m-2" title={this.state.selectedCategory.name ? this.state.selectedCategory.name : "Categories"}>
                            {   (Array.isArray(this.state.categories) && this.state.categories.length) ? this.state.categories.map(
                                    category =>
                                    <Dropdown.Item onClick={ this.setCategory} id={category._id} name={category.name}>{category.name}</Dropdown.Item>
                                    ) : null
                                }
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" className={this.state.showSubCategories ? "m-2" : "notDisplay" } title={this.state.selectedSubCategory.name ? this.state.selectedSubCategory.name : "Subcategories"}>
                            {   (Array.isArray(this.state.subcategories) && this.state.subcategories.length) ? this.state.subcategories.map(
                                    category =>
                                    <Dropdown.Item onClick={ this.setSubCategory} id={category._id} name={category.name}>{category.name}</Dropdown.Item>
                                    ) : null
                                }
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" className="m-2" title={this.state.selectedRegion.name ? this.state.selectedRegion.name : "Regions"}>
                            {   (Array.isArray(this.state.regions) && this.state.regions.length) ? this.state.regions.map(
                                    region =>
                                    <Dropdown.Item onClick={ e => this.setRegion(e) } id={region._id} name={region.name}>{region.name}</Dropdown.Item>
                                    ) : null
                                }
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" className={this.state.showProvinces ? "m-2" : "notDisplay" } title={this.state.selectedProvince.name ? this.state.selectedProvince.name : "Provinces"} >
                            {   (Array.isArray(this.state.provinces) && this.state.provinces.length) ? this.state.provinces.map(
                                    province =>
                                    <Dropdown.Item onClick={ this.setProvince } id={province._id} name={province.name}>{province.name} </Dropdown.Item>
                                    ) : null
                                }
                            </DropdownButton>
                            <input ref={ this.minPriceField } className="form-control mr-sm-2" onChange={this.handleChange} type="search" placeholder="Min" aria-label="Search"/>
                            <input ref={ this.maxPriceField } className="form-control mr-sm-2" onChange={this.handleChange} type="search" placeholder="Max" aria-label="Search"/>
                            <button className="btn btn-outline-success my-2 my-sm-0" onClick={e => {e.preventDefault();this.handleSearch()}} type="submit">Search</button>
                        </form>
                </nav>
            </React.Fragment>
         );

    }



}

export default SearchBar;
