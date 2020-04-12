import React, { Component } from 'react';
import placeholder from '../assets/images/placeholder.png';

import location from '../assets/icons/pin.png';
import user from '../assets/icons/user.png';



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
                <div className="content">
                    <div className="info primary">
                        <div className="line">
                            <div className="title">
                                { this.state.title }
                            </div>
                        </div>
                        <div className="line">
                            <div className="description">
                                { this.state.body }
                            </div>
                        </div>
                    </div>
                    <div className="info secondary">
                        <div className="line">
                            <div className="location">
                                <img src={ location } />
                                { this.state.region }
                                { this.state.province }
                                { this.state.town }
                            </div>
                            <div className="author">
                                <img src={ user } />
                                {this.state.author}
                            </div>
                        </div>
                        <div className="line">
                            <div className="price">
                                {this.state.price}
                            </div>
                            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Buy now</button>
                        </div>
                    </div>
                </div>
            </div>

         );
    }
}

export default Ad;
