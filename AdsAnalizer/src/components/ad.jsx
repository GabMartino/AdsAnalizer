import React, { Component } from 'react';
import placeholder from '../assets/images/placeholder.png';


class Ad extends Component {
    state = {
        title: this.props.title,
        body: this.props.body
     }
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(props){
        this.setState({ title: props.title,
                        body: props.body});
        //this.setState(this.state);
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
