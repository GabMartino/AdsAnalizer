import React, { Component } from 'react';
import Ad from './ad';
import axios from 'axios';

class Feed extends Component {
    state = {
        ads: []
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        this.fetchAds();
    }
    componentWillReceiveProps(props){
        console.log("vediamo");
        if(props.adsList != null){
            this.setState({ ads: props.adsList});
            //this.setState(this.state);
        }
       
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

                { this.state.ads ? this.state.ads.map( ad => <Ad
                    body={ad.body}
                    title={ad.subject}
                />) : null
            }

            </div>


        );
    }
}

export default Feed;
