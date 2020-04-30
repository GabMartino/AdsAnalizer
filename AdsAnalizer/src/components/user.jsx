import React, { Component } from 'react';
import placeholder from '../assets/images/placeholder.png';

import location from '../assets/icons/pin.png';
import user from '../assets/icons/user.png';



class User extends Component {
    state = {
        name: null,
        phoneNumber: null,
        numAds: null,
        minPrice: null,
        maxPrice: null,
        dataCatChart: null,
        dataProvChart: null
     }
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(props){
       /* this.setState({ name: props.name,
                        phoneNumber: props.phoneNumber,
                        numAds: props.numAds,
                        minPrice: props.minPrice,
                        maxPrice: props.maxPrice,
                        dataCatChart: props.dataCatChart,
                        dataProvChart: props.dataProvChart});*/
    }
    render() {
        return (

            <div className="ad_tile">
                <div className="img">
                    <img src={ placeholder } alt="Generic placeholder image"/>
                </div>

                
            </div>

         );
    }
}

export default User;
