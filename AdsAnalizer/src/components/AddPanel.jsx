import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';
class AddPanel extends Component {


    constructor(props){

        super(props);
        this.setCategory = this.setCategory.bind(this);
        this.setRegion = this.setRegion.bind(this);
        this.setProvince = this.setProvince.bind(this);
        this.adTitle = React.createRef();
        this.adDescription = React.createRef();
        this.adPrice = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setSubCategory = this.setSubCategory.bind(this);
    }

    state = {
        actualUser: {},
        title: "",
        description: "",
        price: null,
        selectedCategory: null,
        selectedSubCategory: null,
        selectedRegion: null,
        selectedProvince: null,
        setTown: null,
        regions: [],
        categories: [],
        subcategories: [],
        provinces: [],
    }
    componentWillReceiveProps(props){
        this.setState({actualUser: props.actualUser});
        console.log("test" + props.actualUser);
    }
    componentDidMount(){
        this.fetchData();
    }

    async fetchData(){
        axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/categories/0'
        ).then(
            (response) => {
                console.log(response);
                this.setState({categories: response.data});
                }
        );

        axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/geos/0').then(
            (response) => {
                this.setState({regions: response.data});
                }
        );
    }

    async setCategory(event){
        const selectedCategory = Array.isArray(this.state.categories) && this.state.categories.find(category => category._id === event.target.id);
        this.setState({ selectedCategory: selectedCategory});
        this.setState({ selectedSubCategory: null });
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
    setProvince(event){
        const selectedProvince = Array.isArray(this.state.provinces) && this.state.provinces.find(province => province._id === event.target.id);
        this.setState({ selectedProvince: selectedProvince });

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
    handleChange(event) {
        switch(event.target){
            case this.adTitle.current:
                this.setState({title: event.target.value});
                break;
            case this.adDescription.current:
                this.setState({description: event.target.value});
                break;
            case this.adPrice.current:
                this.setState({price: event.target.value});
                break;
            case this.town.current:
                this.setState({setTown: event.target.value});
                break;
        }
    }
    handleSubmit(){
        if( this.state.title != "" && this.state.description != "" && this.state.selectedCategory != null){
            var actualDateTime = new Date();
            actualDateTime = actualDateTime.getFullYear() + "-" + actualDateTime.getMonth() + "-" + actualDateTime.getDay() + " " +
                                actualDateTime.getHours() + ":" + actualDateTime.getMinutes() + ":" + actualDateTime.getSeconds();
            var newAd = {
                subject: this.state.title,
                body: this.state.description,
                date: actualDateTime,
                features: [{ name: "Prezzo", value: parseFloat(this.state.price)}],
                category:  this.state.selectedCategory,
                advertiser: {
                    name: this.state.actualUser.name,
                    phone: this.state.actualUser.phone,
                    userId: this.state.actualUser._id

                },
                geo: { region: this.state.selectedRegion,
                        province: this.state.selectedProvince,
                        town: this.state.town}

            }
            this.sendData(this, newAd);
            this.props.showAdd(false);
        }else{
            alert("Fill all fields.");
        }


    }
    async sendData(obj, data){
        await axios.post('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/ads', data, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
            }).then(function (response){
                console.log(response);
                if(response.status == 200 && response.data != "notFound"){
                       // obj.setState({userLogged: response.data});
                       // obj.props.doLogIn(response.data);
                       alert("The add has been successfully added.");
                }else{
                        alert("Something gone wrong");
                }

          }).catch(function (error) {
                console.log(error);
          });
    }
    render() {

        return (
            <form class="add_panel">
                <div className="title">Add Panel</div>
                <div className="content">
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Name</label>
                        <input ref={ this.adTitle } type="text" onChange={this.handleChange} className="form-control"  aria-describedby="emailHelp" placeholder="Title"/>
                    </div>
                    <div className="form-group">
                        <label >Description</label>
                        <input ref={ this.adDescription } type="text" onChange={this.handleChange} className="form-control"  placeholder="Description"/>
                    </div>
                    <DropdownButton id="dropdown-basic-button" className="m-2" title={this.state.selectedCategory ? this.state.selectedCategory.name : "Categories"}>
                        {   (Array.isArray(this.state.categories) && this.state.categories.length) ? this.state.categories.map(
                                category =>
                                <Dropdown.Item onClick={ this.setCategory} id={category._id} name={category.name}>{category.name}</Dropdown.Item>
                                ) : null
                            }
                    </DropdownButton>
                    <DropdownButton id="dropdown-basic-button" className={this.state.showSubCategories ? "m-2" : "notDisplay" } title={this.state.selectedSubCategory ? this.state.selectedSubCategory.name : "Subcategories"}>
                        {   (Array.isArray(this.state.subcategories) && this.state.subcategories.length) ? this.state.subcategories.map(
                                category =>
                                <Dropdown.Item onClick={ this.setSubCategory} id={category._id} name={category.name}>{category.name}</Dropdown.Item>
                                ) : null
                            }
                    </DropdownButton>
                    <DropdownButton id="dropdown-basic-button" className="m-2" title={this.state.selectedRegion ? this.state.selectedRegion.name : "Regions"}>
                        {   (Array.isArray(this.state.regions) && this.state.regions.length) ? this.state.regions.map(
                                region =>
                                <Dropdown.Item onClick={ e => this.setRegion(e) } id={region._id} name={region.name}>{region.name}</Dropdown.Item>
                                ) : null
                            }
                    </DropdownButton>
                    <DropdownButton id="dropdown-basic-button" className={this.state.showProvinces ? "m-2" : "notDisplay" } title={this.state.selectedProvince ? this.state.selectedProvince.name : "Provinces"} >
                        {   (Array.isArray(this.state.provinces) && this.state.provinces.length) ? this.state.provinces.map(
                                province =>
                                <Dropdown.Item onClick={ this.setProvince } id={province._id} name={province.name}>{province.name} </Dropdown.Item>
                                ) : null
                            }
                    </DropdownButton>
                    <div className={this.state.selectedProvince ? "form-group m-2" : "notDisplay" }>
                        <label >Town</label>
                        <input ref={ this.town } type="text" onChange={this.handleChange} className="form-control"  placeholder="Town"/>
                    </div>
                    <div className="form-group">
                        <label >Price</label>
                        <input ref={ this.adPrice } type="text" onChange={this.handleChange} className="form-control"  placeholder="Price"/>
                    </div>
                </div>
                <div className="interactions">
                    <button type="submit" onClick={e => {e.preventDefault();this.handleSubmit()}} className="btn btn-primary">Submit</button>
                </div>
            </form>


         );

    }



}

export default AddPanel;
