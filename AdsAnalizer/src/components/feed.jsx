import React, { Component } from 'react';
import Ad from './ad';
import axios from 'axios';

class Feed extends Component {
    state = { 
        ads: []
    }

    componentDidMount(){
        this.fetchAds();
    }

    async fetchAds(){
        axios.get('http://127.0.0.1:3001/ads').then(
            (response) => {
                this.setState({ads: response.data});
                }
        );
    }

    render() { 
        return (  
            <div>
                { this.state.ads.map( ad => <Ad
                    body={ad.body}
                />)
            }
            </div>
            

        );
    }
}
 
export default Feed;