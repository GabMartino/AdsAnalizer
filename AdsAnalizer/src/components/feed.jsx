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
        axios.get('http://'+window.location.hostname+':'+this.props.webServerPort+'/ads').then(
            (response) => {
                this.setState({ads: response.data});
                }
        );
    }

    render() {
        return (
            <div id="feed">

                { this.state.ads.map( ad => <Ad
                    body={ad.body}
                />)
            }

            </div>


        );
    }
}

export default Feed;
