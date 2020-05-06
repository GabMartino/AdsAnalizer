import React, { Component } from 'react';

import axios from 'axios';
import ExpandedUser from './ExpandedUser'
import placeholder from '../assets/images/placeholder.png';
import location from '../assets/icons/pin.png';
import user from '../assets/icons/user.png';



class User extends Component {
    state = {
        data: null,
        idUser: this.props.idUser,
        name: this.props.name,
        phoneNumber: this.props.phone,
        numAds: this.props.numAds,
     }
    constructor(props){
        super(props);

        
        this.closeExpand = React.createRef();
    }
    componentDidMount(){
        this.initListeners();
    }
    componentWillReceiveProps(props){
        this.setState({ name: props.name,
                        phoneNumber: props.phone,
                        numAds: props.numAds});
    }
    initListeners(){

        this.closeExpand.current.addEventListener( "click", (event) => {
            if( event.target === this.closeExpand.current ){
                this.expand();
            }
        } )

    }
    expand(){

        this.setState({
            isExpanded: !this.state.isExpanded
        });

    }
    async fetchData(){
        //console.log('http://'+this.props.webServerIP+':'+this.webServerPort+'/stats/users/'+this.props.idUser);
        await axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/stats/users/'+this.props.idUser, null, {
            withCredentials: true,
        }).then((response) =>{
                if(response.status == 200){
                    console.log(response.data);
					this.setState({ data: response.data});

                }else{
                    alert("Something's gone wrong");
                }

          }).catch(function (error) {
                console.error(error);
          });


    }
    render() {
        return (

            <div className="ad_tile">
                <div className="img">
                    <img src={ placeholder } alt="Generic placeholder image"/>
                </div>
               
                <div className="content">
                    <div className="info primary">
                        <div className="line">
                            <div className="title">
                                { this.state.name }
                            </div>
                        </div>
                        <div className="line">
                            <div className="description">
                                Number of Ads :{ this.state.numAds }
                                

                            </div>
                            
                        </div>
                    </div>
                    <div ref={ this.closeExpand } className={ this.state.isExpanded ? "expandedAd_container expand" : "expandedAd_container" }>
                        <ExpandedUser  
                                data = {this.state.data}
                                idUser = {this.props.idUser}
                                name = {this.props.name}
                                numAds = {this.props.numAds}
                                phone = {this.props.phone}
                                    />
                    </div>
                    
                    <div className="info secondary">
                        <div className="line">
                            <div className="author">
                                <img src={ user } />
                                { this.state.phoneNumber}
                            </div>
                            <button onClick={() =>{this.fetchData();this.expand(); }} className="btn btn-outline-success my-2 my-sm-0" type="submit" >Expand</button>
                        </div>
                    </div>
                </div>            
            </div>

         );
    }
}

export default User;
