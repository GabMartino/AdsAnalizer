import React, { Component } from 'react';
import placeholder from '../assets/images/placeholder.png';


class Ad extends Component {
    state = {
        src: "https://picsum.photos/200",
        title: "Lorem ipsum",
        body: this.props.body
     }
    constructor(props){
        super(props);
    }
    render() {
        return (
            <div className="ad_tile">
                <div className="img">
                    <img src={ placeholder } alt="Generic placeholder image"/>
                </div>
                <div className="info">
                    <div className="utils"></div>
                    <div className="title">
                        { this.state.title }
                    </div>
                    <div className="description">
                        { this.state.body }
                    </div>
                </div>
            </div>
         );
    }
}

export default Ad;
