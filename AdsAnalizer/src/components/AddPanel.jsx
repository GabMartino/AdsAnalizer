import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';
class AddPanel extends Component {


    constructor(props){

        super(props);
        this.setCategory = this.setCategory.bind(this);
        this.setRegion = this.setRegion.bind(this);
        this.setProvince = this.setProvince.bind(this);
    }

    state = {
        selectedCategory: { id: null, name:null},
        selectedRegion: { id: null, name: null},
        selectedProvince: { id: null, name: null},
        regions: [],
        categories: [],
        provinces: [],
    }
    componentDidMount(){
        this.fetchData();
    }

    async fetchData(){
        axios.get('http://'+window.location.hostname+':'+this.props.webServerPort+'/categories', 
            {
                params: {
                    val: 0
                }
            }
        ).then(
            (response) => {
                console.log(response);
                this.setState({categories: response.data});
                }
        );

        axios.get('http://'+window.location.hostname+':'+this.props.webServerPort+'/geos',{
            params: {
                val: 0
            }
        }).then(
            (response) => {
                this.setState({regions: response.data});
                }
        );
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

        axios.get('http://'+window.location.hostname+':'+this.props.webServerPort+'/geos/',{
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
    handleSubmit(){



    }
    render() {

        return (
            <form>
                <b>Add Panel</b>
                <div className="form-group">
                    <label for="exampleInputEmail1">Name</label>
                    <input type="text" className="form-control"  aria-describedby="emailHelp" placeholder="Title"/>
                </div>
                <div className="form-group">
                    <label >Description</label>
                    <input type="text" className="form-control"  placeholder="Description"/>
                </div>
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
                <button type="submit" onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
            </form>


         );

    }



}

export default AddPanel;
