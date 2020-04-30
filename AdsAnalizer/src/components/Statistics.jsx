import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton, Tabs, Tab } from 'react-bootstrap';
import BarChart from './barChart';
import consts from '../consts';

class Statistics extends Component {

    //Chart Model parameters
    
    constructor(props){

        super(props);
        
        this.fetchData = this.fetchData.bind(this);
        this.setRegion = this.setRegion.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    state = {
        dataset: null,
        selectedCategory: null,
        categories: [],
        selectedRegion: null,
        regions: [],

        //first charts
        yValuesNumberOfAds: [],
        yValuesAveragePrices: [],
        xAxisNumberOfAds: [],
        xAxisAveragePrices: [],
        nameSeries1: "Number Of Ads",
        nameSeries2: "Average Price",

        //chart for price distribution
        showPriceDistrChart: false,
        yValuePriceDistr: [],
        xAxisPriceDistr: [],
        nameSeries3: "Price Distribution"


    }
    componentDidMount(){
        this.fetchData();
    }
    setCategory(event){
        const selectedCategory = Array.isArray(this.state.categories) && this.state.categories.find(category => category._id === event.target.id);
        this.setState({ selectedCategory: selectedCategory});
        //console.log(window.location.hostname);
     
    }
    setRegion(event){
        event.preventDefault();
        const selectedRegion = Array.isArray(this.state.regions) && this.state.regions.find(region => region._id === event.target.id);
        this.setState({selectedRegion: selectedRegion });
      
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

    handleSearch(PARAM, searchFieldsFromCharts){
        let restParam = null;
        let searchFields = null;
        switch(PARAM){

            case consts.STAT_GEO : 
                                restParam = this.state.selectedCategory ? this.state.selectedCategory._id : null;   
                                if(!restParam) return;
                                searchFields = {
                                    params: {
                                        geo: this.state.selectedRegion ? this.state.selectedRegion._id : null
                                    }
                                };
                                this.requireData("categories/" + restParam, this.state.selectedRegion ? searchFields : null, PARAM);
                                break;

            case consts.STAT_PRICE_DISTR:
                                restParam = this.state.selectedCategory ? this.state.selectedCategory._id : null;   
                                if(!restParam) return;

                                let RegionSelected = this.state.regions.find( (region) => {
                                        return (region.name === searchFieldsFromCharts ? region : null);
                                    });
                                    console.log("printing region id selected");
                                    console.log(RegionSelected)
                                searchFields = {
                                    params: {
                                        geo: RegionSelected._id
                                    }
                                };
                                this.requireData("categories/" + restParam + "/prices", searchFields, PARAM);
                                break;
            
                                

        }
    }

    async requireData(restParam, searchFields, kindOfStat){
        await axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/stats/'+restParam, searchFields).then(
            (response) => {
                    switch(kindOfStat){
                        case consts.STAT_GEO:
                                let xAxis = response.data.map( object => object.name);
                                let avgPrices = response.data.map( object => object.avg_price);
                                let numAds = response.data.map( object => object.num_ads);
                                var x = 0;
                                while(x < avgPrices.length){ 
                                    avgPrices[x] = avgPrices[x].toFixed(2); 
                                    x++;
                                }
                                this.setState({ yValuesNumberOfAds: numAds});
                                this.setState({ yValuesAveragePrices: avgPrices});
                                this.setState({ xAxisNumberOfAds: xAxis});
                                this.setState({ xAxisAveragePrices: xAxis});
                                break;
                        case consts.STAT_PRICE_DISTR:
                                console.log(response.data);
                    }
                    
                }
        );
    }
    handleSelect(){
        this.forceUpdate();
    }
    cleanSearchFields(){
        this.setState({
            selectedCategory: null,
            selectedRegion: null,
        });
    }
    render() {
     
        return (
            <div >
                 <div>
                    {this.state.title}
                </div>
                <nav className="navbar nav_2  navbar-light">
                        <form className="statParam">
                            <DropdownButton id="dropdown-basic-button" className="m-2" title={this.state.selectedCategory != null ? this.state.selectedCategory.name : "Categories"}>
                            {   (Array.isArray(this.state.categories) && this.state.categories.length) ? this.state.categories.map(
                                    category =>
                                    <Dropdown.Item onClick={ this.setCategory} id={category._id} name={category.name}>{category.name}</Dropdown.Item>
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
                            <button className="btn btn-outline-success my-2 my-sm-0" onClick={e => {e.preventDefault();this.handleSearch(consts.STAT_GEO)}} type="submit">Search</button>
                            <button className="btn btn-outline-success my-2 my-sm-0 m-2" onClick={e => {e.preventDefault();this.cleanSearchFields()}} type="submit">Clear</button>
                        </form>
                </nav>
              
                <div >
                    <Tabs defaultActiveKey="first" id="uncontrolled-tab-example" onSelect={this.handleSelect}>
                        <Tab eventKey="first" title="Number Of Ads">
                                <BarChart 
                                    regionSelected = {this.state.selectedRegion != null}
                                    yaxis= {this.state.yValuesNumberOfAds}
                                    xaxis = {this.state.xAxisNumberOfAds}
                                    nameSeries = {this.state.nameSeries1}
                                    callStat = {this.handleSearch.bind(this)}
                               />
                        </Tab>
                        <Tab eventKey="second" title="Average Price">
                                <BarChart
                                    regionSelected = {this.state.selectedRegion != null}
                                    yaxis= {this.state.yValuesAveragePrices}
                                    xaxis = {this.state.xAxisAveragePrices}
                                    nameSeries = {this.state.nameSeries2}
                                    callStat = {this.handleSearch.bind(this)}
                               />
                        </Tab>
                    </Tabs>
                    <div className={this.state.showPriceDistrChart ? "" : "notDisplay"}>
                        <BarChart
                            
                            yaxis = {this.state.yValuePriceDistr}
                            xaxis = {this.state.xAxisPriceDistr}
                            nameSeries = {this.state.nameSeries3}
                               />
                    </div>
                    
                </div>
            </div>


         );

    }



}

export default Statistics;
