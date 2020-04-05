import React, { Component } from 'react';
import placeholder from '../assets/images/placeholder.png';


class Ad extends Component {
    state = {
        title: this.props.title,
        body: this.props.body,
        region: this.props.region,
        province: this.props.province,
        town: this.props.town,
        price: this.props.price,
        author: this.props.author
     }
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(props){
        this.setState({ title: props.title,
                        body: props.body,
                        region: props.region,
                        province: props.province,
                        town: props.town,
                        price: props.price,
                        author: props.author});
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
                    <div className="geographic details">
                        { this.state.region }
                        { this.state.province }
                        { this.state.town }
                    </div>
                    <div className="price details">
                        {this.state.price}
                    </div>
                    <div className="author details">
                        {this.state.author}
                    </div>
                </div>
            </div>
         );
    }
}

export default Ad;
