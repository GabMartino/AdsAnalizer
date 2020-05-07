import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton, Form  } from 'react-bootstrap';
import consts from '../consts';
class SearchBar extends Component {

    state = {

        searchString: null,
        minPriceValue: null,
        maxPriceValue: null,
        selectedCategory: null,
        selectedSubCategory: null,
        selectedRegion: null,
        neighborsRegions: false,
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
        this.checkBox = React.createRef();
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
            case this.checkBox.current:

                this.setState({neighborsRegions: this.checkBox.current.checked});
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
                pag: 0
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
        if(this.state.neighborsRegions){
            searchFields.params.nei = 1;
        }
        this.props.fetchData(consts.ADS, searchFields);

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
            minPriceValue: null,
            maxPriceValue: null,
            neighborsRegions: false
        });
        this.searchField.current.value = null;
        this.minPriceField.current.value = null;
        this.maxPriceField.current.value = null;
    }

    render() {

        return (
            <React.Fragment>
                <nav className="navbar nav_2 navbar-expand-lg navbar-light">
                        <p className="label">Search Ads</p>
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
                            <div className={this.state.selectedRegion && !this.state.selectedProvince ? "custom-control custom-checkbox" : "notDisplay"}>
                                <input ref= {this.checkBox} type="checkbox" className="custom-control-input" id="defaultUnchecked" checked={this.state.neighborsRegions} onChange={this.handleChange}></input>
                                <label className="custom-control-label m-2 " for="defaultUnchecked">Neighbors Regions</label>
                            </div>
                            <DropdownButton id="dropdown-basic-button" className={this.state.showProvinces && !this.state.neighborsRegions ? "m-2" : "notDisplay" } title={this.state.selectedProvince != null ? this.state.selectedProvince.name : "Provinces"} >
                            {   (Array.isArray(this.state.provinces) && this.state.provinces.length) ? this.state.provinces.map(
                                    province =>
                                    <Dropdown.Item onClick={ this.setProvince } id={province._id} name={province.name}>{province.name} </Dropdown.Item>
                                    ) : null
                                }
                            </DropdownButton>
                            <input ref={ this.minPriceField } className="form-control mr-sm-2 tiny_text" onChange={this.handleChange} type="search" placeholder="Min" aria-label="Search"/>
                            <input ref={ this.maxPriceField } className="form-control mr-sm-2 tiny_text" onChange={this.handleChange} type="search" placeholder="Max" aria-label="Search"/>
                            <button className="btn btn-primary my-2 my-sm-0 m-2" onClick={e => {e.preventDefault();this.cleanSearchFields()}} type="submit">Clear</button>
                            <button className="btn btn-outline-success my-2 my-sm-0" onClick={e => {e.preventDefault();this.handleSearch()}} type="submit">Search</button>
                        </form>
                </nav>
            </React.Fragment>
         );

    }



}

export default SearchBar;
