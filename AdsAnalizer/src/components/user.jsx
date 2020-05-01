import React, { Component } from 'react';

import PieChart from './pieChart';
import placeholder from '../assets/images/placeholder.png';
import location from '../assets/icons/pin.png';
import user from '../assets/icons/user.png';



class User extends Component {
    state = {
        idUser: this.props.idUser,
        name: this.props.name,
        phoneNumber: this.props.phone,
        numAds: this.props.numAds,
     }
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(props){
        this.setState({ name: props.name,
                        phoneNumber: props.phone,
                        numAds: props.numAds});
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
                                { this.state.numAds }
                                { this.state.phoneNumber}

                            </div>

                        </div>
                    </div>
                    <PieChart/>
                    <div className="info secondary">
                        <div className="line">
                            <div className="location">
                                <img src={ location } />
                               
                            </div>
                            <div className="author">
                                <img src={ user } />
                               
                            </div>
                        </div>
                        <div className="line">
                            <div className="price">
                             
                            </div>
                           
                        </div>
                    </div>
                </div>            
            </div>

         );
    }
}

export default User;
