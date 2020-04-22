import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import Chart from 'react-apexcharts'
class Statistics extends Component {


    constructor(props){

        super(props);
        
        this.fetchData = this.fetchData.bind(this);
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
            
            this.sendData(searchFields);
        }
        
        
       
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
                <div className={ "plot"}>
                    <Chart options={this.state.options} series={this.state.series} type="bar" width={500} height={320} />
                </div>
            </div>


         );

    }



}

export default Statistics;
