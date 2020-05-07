import React, { Component } from 'react';
import Ad from './ad';
import User from './user'
import axios from 'axios';
import consts from '../consts';

class Feed extends Component {
    state = {
        data: this.props.data
    }
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(props){
        if(props.data != null){
            this.setState({ data: props.data});
          
        }
        
    }
    render() {
        return (
            <div id="feed">
                
                { Array.isArray(this.state.data) && this.state.data.length ? this.state.data.map( item => {
              
                if( this.props.kindOfResult == consts.ADS ){
                        return <Ad
                                item = {item}
                                admin = {this.props.admin}
                                userLoggedId = {this.props.userLoggedId}
                                reported= {item.report ? item.report : 0}
                                showDelete = {item.advertiser && parseInt(item.advertiser.userId) == parseInt(this.props.userLoggedId) || this.props.admin}
                                deleteAd = { this.props.deleteAd}
                                reportAd = { this.props.reportAd}
                            />
                }else{
                    return <User
                        idUser = {item._id}
                        name = {item.username}
                        numAds = {item.num_ads}
                        phone = {item.phone}
                        webServerIP = {this.props.webServerIP}
                        webServerPort={ this.props.webServerPort }
                    
                    />


                }
                    
                    
                    
                    
                    }
                
                
                )  : null
            }

            </div>


        );
    }
}

export default Feed;
