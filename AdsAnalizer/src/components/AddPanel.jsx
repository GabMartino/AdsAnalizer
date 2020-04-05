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

    }

    state = {
        actualUser: {},
        title: "",
        description: "",
        price: null,
        selectedCategory: { id: null, value: null},
        selectedRegion: { id: null, value: null},
        selectedProvince: { id: null, value: null},
        regions: [],
        categories: [],
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

   
    async setRegion(event){
        event.preventDefault();
        let prop = {...this.state.selectedRegion};
        prop.id = event.target.id;
        prop.name = event.target.name;
       
        this.setState({selectedRegion: prop });
        await axios.get('http://'+window.location.hostname+':'+this.props.webServerPort+'/geos',{
            params: {
                val: prop.id
            }
        }).then(
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
        }
    }
    handleSubmit(){
        if( this.state.title != "" && this.state.description != "" && this.state.selectedCategory.id != null){
            var actualDateTime = new Date();
            actualDateTime = actualDateTime.getFullYear() + "-" + actualDateTime.getMonth() + "-" + actualDateTime.getDay() + " " +
                                actualDateTime.getHours() + ":" + actualDateTime.getMinutes() + ":" + actualDateTime.getSeconds();
            var newAd = {
                subject: this.state.title,
                body: this.state.description,
                date: actualDateTime,
                features: [{ name: "Prezzo", value: parseFloat(this.state.price)}],
                category:  this.state.selectedCategory,
                advertiser: { name: this.state.actualUser.name,
                                phone: this.state.actualUser.telephone,
                                userId: this.state.actualUser.id },
                geo: { region: this.state.selectedRegion, province: this.state.selectedProvince}

            }
            this.sendData(this, newAd);
            this.props.showAdd(false);
        }else{
            alert("Fill all fields.");
        }
        

    }
    async sendData(obj, data){
        await axios.post('http://'+window.location.hostname+':'+this.props.webServerPort+'/ads', data, {
            headers: { 'Content-Type': 'application/json' },
            }).then(function (response){
                console.log(response);
                if(response.status == 200 && response.data != "notFound"){
                       // obj.setState({userLogged: response.data});
                       // obj.props.doLogIn(response.data);
                }else{
                        alert("Username or Password wrong");
                }
            
          }).catch(function (error) {
                console.log(error);
          });
    }
    render() {

        return (
            <form>
                <b>Add Panel</b>
                <div className="form-group">
                    <label for="exampleInputEmail1">Name</label>
                    <input ref={ this.adTitle } type="text" onChange={this.handleChange} className="form-control"  aria-describedby="emailHelp" placeholder="Title"/>
                </div>
                <div className="form-group">
                    <label >Description</label>
                    <input ref={ this.adDescription } type="text" onChange={this.handleChange} className="form-control"  placeholder="Description"/>
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
                <div className="form-group">
                    <label >Price</label>
                    <input ref={ this.adPrice } type="text" onChange={this.handleChange} className="form-control"  placeholder="Price"/>
                </div>
                <button type="submit" onClick={e => {e.preventDefault();this.handleSubmit()}} className="btn btn-primary">Submit</button>
            </form>


         );

    }



}

export default AddPanel;
