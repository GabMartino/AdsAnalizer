import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';

class SearchBar extends Component {

    state = {

        searchString: null,
        minPriceValue: null,
        maxPriceValue: null,
        selectedCategory: null,
        selectedSubCategory: null,
        selectedRegion: null,
        selectedProvince: null,
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
        this.cleanSearchFields = this.cleanSearchFields.bind(this);

    }
    componentDidMount(){
        this.fetchData();
    }

    async fetchData(){
        axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/categories/0'
        ).then(
            (response) => {
                console.log("Fetching all categories for the first time");
                console.log(response.data);
                this.setState({categories: response.data});
                }
        );

        axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/geos/0').then(
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
                var value = event.target.value != '' ? event.target.value : null;
                this.setState({minPriceValue: value});
                break;
            case this.maxPriceField.current:
                var value = event.target.value != '' ? event.target.value : null;
                this.setState({maxPriceValue: value});
        }
    }

    async setCategory(event){
        const selectedCategory = Array.isArray(this.state.categories) && this.state.categories.find(category => category._id === event.target.id);
        this.setState({ selectedCategory: selectedCategory});
        this.setState({ selectedSubCategory: null });
        //console.log(window.location.hostname);
        await axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/categories/'+selectedCategory._id).then(
            (response) => {
                this.setState({subcategories: response.data});
                
                }
        );
        this.setState({ showSubCategories: true });
    }
    setSubCategory(event){
        const selectedSubCategory = Array.isArray(this.state.subcategories) && this.state.subcategories.find(category => category._id === event.target.id);
        this.setState({ selectedSubCategory: selectedSubCategory });

    }

    async setRegion(event){
        event.preventDefault();
        const selectedRegion = Array.isArray(this.state.regions) && this.state.regions.find(region => region._id === event.target.id);
        this.setState({selectedRegion: selectedRegion });
        this.setState({selectedProvince: null });
        //console.log(window.location.hostname);
        await axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/geos/'+selectedRegion._id).then(
            (response) => {
                this.setState({provinces: response.data});
                
                }
        );
        this.setState({ showProvinces: true });

    }
    setProvince(event){
        const selectedProvince = Array.isArray(this.state.provinces) && this.state.provinces.find(province => province._id === event.target.id);
        this.setState({ selectedProvince: selectedProvince });

    }

    //HANDLE RESEARCH
    handleSearch(){
        let searchFields = {
            params: {

            }
        };
        if(this.state.searchString != null && this.state.searchString != ''){
            searchFields.params.src = this.state.searchString;
        }
        if(this.state.selectedSubCategory != null){
            searchFields.params.cat = this.state.selectedSubCategory._id;
        }else if(this.state.selectedCategory != null){
           searchFields.params.cat = this.state.selectedCategory._id;
        }
        if(this.state.selectedRegion != null){
            searchFields.params.geo = this.state.selectedRegion._id;
            if(this.state.selectedProvince != null){
                searchFields.params.geo = this.state.selectedProvince._id;
            }
        }
        if(this.state.minPriceValue != null){
            searchFields.params.min = this.state.minPriceValue;
        }
        if(this.state.maxPriceValue != null){
            searchFields.params.max = this.state.maxPriceValue;
        }
        console.log(searchFields);
        this.sendData(searchFields);
       
    }

    async sendData(searchFields){
        await axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/ads', searchFields).then(
            (response) => {
                    this.setState({searchResult: response.data});
                    console.log(response.data);
                    this.props.reportResult(this.state.searchResult);
                }
        );
    }
    cleanSearchFields(){
        this.setState({
            selectedCategory: null,
            selectedSubCategory: null,
            selectedRegion: null,
            selectedProvince: null,
            showSubCategories: false,
            showProvinces: false,
            searchString: null,
        });
        this.searchField.current.value = null;
    }

    render() {

        return (
            <React.Fragment>
                <nav className="navbar nav_2 navbar-expand-lg navbar-light">
                        <form className="form-inline my-2 my-lg-0">
                            <input ref={ this.searchField } className="form-control mr-sm-2"  onChange={this.handleChange} type="search" placeholder="Search" aria-label="Search"/>
                            <DropdownButton id="dropdown-basic-button" className="m-2" title={this.state.selectedCategory != null ? this.state.selectedCategory.name : "Categories"}>
                            {   (Array.isArray(this.state.categories) && this.state.categories.length) ? this.state.categories.map(
                                    category =>
                                    <Dropdown.Item onClick={ this.setCategory} id={category._id} name={category.name}>{category.name}</Dropdown.Item>
                                    ) : null
                                }
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" className={this.state.showSubCategories ? "m-2" : "notDisplay" } title={this.state.selectedSubCategory != null ? this.state.selectedSubCategory.name : "Subcategories"}>
                            {   (Array.isArray(this.state.subcategories) && this.state.subcategories.length) ? this.state.subcategories.map(
                                    category =>
                                    <Dropdown.Item onClick={ this.setSubCategory} id={category._id} name={category.name}>{category.name}</Dropdown.Item>
                                    ) : null
                                }
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" className="m-2" title={this.state.selectedRegion != null ? this.state.selectedRegion.name : "Regions"}>
                            {   (Array.isArray(this.state.regions) && this.state.regions.length) ? this.state.regions.map(
                                    region =>
                                    <Dropdown.Item onClick={ e => this.setRegion(e) } id={region._id} name={region.name}>{region.name}</Dropdown.Item>
                                    ) : null
                                }
                            </DropdownButton>
                            <DropdownButton id="dropdown-basic-button" className={this.state.showProvinces ? "m-2" : "notDisplay" } title={this.state.selectedProvince != null ? this.state.selectedProvince.name : "Provinces"} >
                            {   (Array.isArray(this.state.provinces) && this.state.provinces.length) ? this.state.provinces.map(
                                    province =>
                                    <Dropdown.Item onClick={ this.setProvince } id={province._id} name={province.name}>{province.name} </Dropdown.Item>
                                    ) : null
                                }
                            </DropdownButton>
                            <input ref={ this.minPriceField } className="form-control mr-sm-2" onChange={this.handleChange} type="search" placeholder="Min" aria-label="Search"/>
                            <input ref={ this.maxPriceField } className="form-control mr-sm-2" onChange={this.handleChange} type="search" placeholder="Max" aria-label="Search"/>
                            <button className="btn btn-outline-success my-2 my-sm-0" onClick={e => {e.preventDefault();this.handleSearch()}} type="submit">Search</button>
                            <button className="btn btn-outline-success my-2 my-sm-0 m-2" onClick={e => {e.preventDefault();this.cleanSearchFields()}} type="submit">Clear</button>
                        </form>
                </nav>
            </React.Fragment>
         );

    }



}

export default SearchBar;
