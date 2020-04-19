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
                    region= {ad.geo.region != null ? ad.geo.region.value : null}
                    province= {ad.geo.province != null ? ad.geo.province.shortName : null}
                    town= {ad.geo.town != null ? ad.geo.town.value : null }
                    price= {Array.isArray(ad.features) && ad.features.length ? ad.features[0].value : null}
                    author={ad.advertiser.name}
                    phoneNumber ={ad.advertiser.phone}
                    reported= {ad.report ? ad.report : false}
                    showDelete = {parseInt(ad.advertiser.userId) == parseInt(this.props.userLoggedId)}
                    deleteAd = { this.props.deleteAd}
                    reportAd = { this.props.reportAd}
                />)  : null
            }

            </div>


        );
    }
}

export default Feed;
