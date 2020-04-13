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
                    body={ad.body}
                    title={ad.subject}
                    region= {ad.geo.region.value}
                    province= {ad.geo.province.shortName}
                    town= {ad.geo.town != null ? ad.geo.town.value : null }
                    price= {Array.isArray(ad.features) && ad.features.length ? ad.features[0].value : null}
                    author={ad.advertiser.name}
                />)  : null
            }

            </div>


        );
    }
}

export default Feed;
