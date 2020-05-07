import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton, Tabs, Tab } from 'react-bootstrap';
import BarChart from './barChart';
import GeoChart from './geoChart';
import HistogramChart from './HistogramChart';
import consts from '../consts';

class Statistics extends Component {

    //Chart Model parameters

    constructor(props){

        super(props);

        this.fetchData = this.fetchData.bind(this);
        this.setRegion = this.setRegion.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.setSubCategory = this.setSubCategory.bind(this);
    }

    state = {
        selectedCategory: null,
        categories: [],
        selectedRegion: null,
        showGeoChart: false,
        regions: [],
        subcategories: [],
        viewCharts: false,
        selectedSubCategory: null,
        showSubCategories: false,
        //first charts
        yValuesNumberOfAds: [],
        yValuesAveragePrices: [],
        xAxisNumberOfAds: [],
        xAxisAveragePrices: [],
        nameSeries1: "Number Of Ads",
        nameSeries2: "Average Price",

        //chart for price distribution
        showPriceDistrChart: false,
        nameOfPriceDistributionChart: "",
        histogramData: null


    }
    componentDidMount(){
        this.fetchData();
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
    setSubCategory(event){
        const selectedSubCategory = Array.isArray(this.state.subcategories) && this.state.subcategories.find(category => category._id === event.target.id);
        this.setState({ selectedSubCategory: selectedSubCategory });

    }
    async handleSearch(PARAM, searchFieldsFromCharts){
        let restParam = null;
        let searchFields = null;
        switch(PARAM){

            case consts.STAT_GEO :
                                restParam = this.state.selectedSubCategory ? this.state.selectedSubCategory._id : (this.state.selectedCategory ? this.state.selectedCategory._id : null);
                                if(!restParam) return;
                                searchFields = {
                                    params: {
                                        geo: this.state.selectedRegion ? this.state.selectedRegion._id : null
                                    }
                                };
                                this.requireData("categories/" + restParam, this.state.selectedRegion ? searchFields : null, PARAM);
                                this.setState({ viewCharts: true});
                                this.setState({ showPriceDistrChart: false});
                                if(this.state.selectedRegion){
                                    this.setState({showGeoChart: true});
                                }
                                break;

            case consts.STAT_PRICE_DISTR:
                                restParam = this.state.selectedCategory ? this.state.selectedCategory._id : null;
                                if(!restParam) return;
                                // if is selected the price distribution will be of province
                                let geoArea = null;
                                if(this.state.selectedRegion){
                                    console.log("await")
                                    let provinces =  await axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/geos/'+this.state.selectedRegion._id).then(
                                        (response) => {
                                                return response.data;
                                            }
                                    );
                                    geoArea = provinces.find( (province) => province.name === searchFieldsFromCharts);
                                }else{
                                    geoArea = this.state.regions.find( (region) => region.name === searchFieldsFromCharts);
                                }

                                searchFields = {
                                    params: {
                                        geo: geoArea._id
                                    }
                                };
                                this.setState({nameOfPriceDistributionChart: geoArea.name});
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
                                this.setState({ showPriceDistrChart: true});
                                this.setState({ histogramData: response.data});
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
            yValuesNumberOfAds: [],
            yValuesAveragePrices: [],
            xAxisNumberOfAds: [],
            xAxisAveragePrices: [],
            showGeoChart: false,
            subcategories: [],
            selectedSubCategory: null,
            showSubCategories: false,
            //chart for price distribution
            showPriceDistrChart: false,
            yValuePriceDistr: [],
            xAxisPriceDistr: [],
            viewCharts: false,
             //chart for price distribution
            nameOfPriceDistributionChart: "",
            histogramData: null
        });
    }
    render() {

        return (
            <div className="stat_panel">
                <div className="statistics_title">
                   <p>Statistics</p>
                </div>
                <nav className="navbar nav_2 navbar-expand-lg navbar-light">
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
                            <button className="btn btn-outline-success my-2 my-sm-0" onClick={e => {e.preventDefault();this.handleSearch(consts.STAT_GEO)}} type="submit">Search</button>
                            <button className="btn btn-outline-success my-2 my-sm-0 m-2" onClick={e => {e.preventDefault();this.cleanSearchFields()}} type="submit">Clear</button>

                </nav>

                <div >
                    {this.state.viewCharts ?
                        <Tabs defaultActiveKey="first" id="uncontrolled-tab-example" onSelect={this.handleSelect}>
                            <Tab eventKey="first" title="Number Of Ads">

                                <Tabs defaultActiveKey="barchart" id="kindOfPlot">
                                        <Tab eventKey="barchart" title="BARCHART">
                                            <BarChart
                                                    title = { "Number of Ads" }

                                                    regionSelected = {this.state.selectedRegion != null}
                                                    yaxis= {this.state.yValuesNumberOfAds}
                                                    xaxis = {this.state.xAxisNumberOfAds}
                                                    nameSeries = "Number of Ads"
                                                    callStat = {this.handleSearch.bind(this)}
                                            />
                                        </Tab>
                                        { this.state.showGeoChart ?   <Tab eventKey="geochart" title="GEOCHART" >
                                            <GeoChart
                                                    kind = { "NUM" }
                                                    regionSelected = {this.state.selectedRegion != null}
                                                    yaxis= {this.state.yValuesNumberOfAds}
                                                    xaxis = {this.state.xAxisNumberOfAds}
                                                    nameSeries = "Number of Ads"
                                            />
                                        </Tab> : null }

                                </Tabs>
                            </Tab>
                            <Tab eventKey="second" title="Average Price">
                                    <Tabs defaultActiveKey="barchart" id="kindOfPlot2">
                                        <Tab eventKey="barchart" title="BARCHART">
                                            <BarChart
                                                    title = { "Average Price" }

                                                    regionSelected = {this.state.selectedRegion != null}
                                                    yaxis= {this.state.yValuesAveragePrices}
                                                    xaxis = {this.state.xAxisAveragePrices}
                                                    nameSeries = "Average Price"
                                                    callStat = {this.handleSearch.bind(this)}
                                            />
                                        </Tab>
                                        { this.state.showGeoChart ?   <Tab eventKey="geochart" title="GEOCHART" >
                                            <GeoChart
                                                    kind = { "AVG" }
                                                    regionSelected = {this.state.selectedRegion != null}
                                                    yaxis= {this.state.yValuesAveragePrices}
                                                    xaxis = {this.state.xAxisAveragePrices}
                                                    nameSeries = "Average Price"
                                            />
                                        </Tab> : null }


                                    </Tabs>
                            </Tab>

                        </Tabs> : null}
                    <div className={this.state.showPriceDistrChart ? "" : "notDisplay"}>
                        <HistogramChart
                            title = {"Price Distribution of " + this.state.nameOfPriceDistributionChart}
                            kindOfChart = "Histogram"
                            data = {this.state.histogramData}
                               />
                    </div>

                </div>
            </div>


         );

    }



}

export default Statistics;
