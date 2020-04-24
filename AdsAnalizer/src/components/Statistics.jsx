import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton, Tabs, Tab } from 'react-bootstrap';
import Chart from 'react-apexcharts'
class Statistics extends Component {


    constructor(props){

        super(props);
        
        this.fetchData = this.fetchData.bind(this);
        this.setRegion = this.setRegion.bind(this);
        this.setCategory = this.setCategory.bind(this);
    }

    state = {
        dataset: this.props.dataset,
        selectedCategory: null,
        categories: [],
        selectedRegion: null,
        regions: [],
        options: {
                    chart: {
                    id: 'apexchart-example'
                    },
                    xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
                    }
                },
        series: [{
            name: 'series-1',
            data: [30, 40, 45, 50, 49, 60, 70, 91]
        }]
            
        
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

    handleSearch(){
        let searchFields = {
            params: {

            }
        };
        if(this.state.selectedCategory != null){
            
            this.requireData(searchFields);
        }
        
        
       
    }

    async requireData(restParam, searchFields){
        await axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/stats/'+restParam, searchFields).then(
            (response) => {
                    this.setState({searchResult: response.data});
                    console.log(response.data);
                    this.props.reportResult(this.state.searchResult);
                }
        );
    }
    render() {
     
        return (
            <div className={ "Statistics"}>
                <div>
                    {this.state.title}
                </div>
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
                <button className="btn btn-outline-success my-2 my-sm-0" onClick={e => {e.preventDefault();this.handleSearch()}} type="submit">Search</button>
                <div className={ "plot1"}>
                    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                        <Tab eventKey="home" title="Number Of Ads">
                            <Chart options={this.state.options} series={this.state.series} type="bar" width={500} height={320} />
                        </Tab>
                        <Tab eventKey="profile" title="Mean Price">
                            <Chart options={this.state.options} series={this.state.series} type="bar" width={500} height={320} />
                        </Tab>
                    </Tabs>
                   
                </div>
                <div className={ "plot2"}>
                    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                        <Tab eventKey="home" title="Number Of Ads">
                            <Chart options={this.state.options} series={this.state.series} type="bar" width={500} height={320} />
                        </Tab>
                        <Tab eventKey="profile" title="Mean Price">
                            <Chart options={this.state.options} series={this.state.series} type="bar" width={500} height={320} />
                        </Tab>
                    </Tabs>
                   
                </div>
            </div>


         );

    }



}

export default Statistics;
