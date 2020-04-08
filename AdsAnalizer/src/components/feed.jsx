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
                    province= {ad.geo.province.value}
                    //town= {ad.geo.town.value}
                    price= {ad.features[0].value}
                    author={ad.advertiser.name}
                />) : null
            }

            </div>


        );
    }
}

export default Feed;
