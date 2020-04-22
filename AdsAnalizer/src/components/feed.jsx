import React, { Component } from 'react';
import Ad from './ad';
import axios from 'axios';

class Feed extends Component {
    state = {
        ads: this.props.adsList
    }
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(props){
        if(props.adsList != null){
            this.setState({ ads: props.adsList});
          
        }
        
    }
    render() {
        return (
            <div id="feed">
                
                { Array.isArray(this.state.ads) && this.state.ads.length ? this.state.ads.map( ad => <Ad
                    admin = {this.props.admin}
                    id = {ad._id}
                    body={ad.body}
                    title={ad.subject}
                    region= {ad.geo && ad.geo.region ? ad.geo.region.value : null}
                    province= {ad.geo && ad.geo.province? ad.geo.province.shortName : null}
                    town= {ad.geo && ad.geo.town? ad.geo.town.value : null }
                    price= {Array.isArray(ad.features) && ad.features.length ? ad.features[0].value : null}
                    author={ad.advertiser}
                    userLoggedId = {this.props.userLoggedId}
                    phoneNumber ={ad.advertiser.phone}
                    reported= {ad.report ? ad.report : 0}
                    showDelete = {parseInt(ad.advertiser.userId) == parseInt(this.props.userLoggedId) || this.props.admin}
                    deleteAd = { this.props.deleteAd}
                    reportAd = { this.props.reportAd}
                />)  : null
            }

            </div>


        );
    }
}

export default Feed;
