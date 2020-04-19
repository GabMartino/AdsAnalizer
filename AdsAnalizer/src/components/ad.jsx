import React, { Component } from 'react';
import placeholder from '../assets/images/placeholder.png';

import location from '../assets/icons/pin.png';
import user from '../assets/icons/user.png';



class Ad extends Component {
    state = {
        admin: false,
        textButton: "Buy now",
        id: this.props.id,
        title: this.props.title,
        body: this.props.body,
        region: this.props.region,
        province: this.props.province,
        town: this.props.town,
        price: this.props.price,
        author: this.props.author,
        phoneNumber: this.props.phoneNumber,
        showDelete: this.props.showDelete,
        reported: this.props.reported
     }
    constructor(props){
        super(props);
        //this.showPhoneNumber = this.showPhoneNumber.bind(this);
    }
    componentWillReceiveProps(props){
        this.setState({ admin: props.admin,
                        id: props.id,
                        title: props.title,
                        body: props.body,
                        region: props.region,
                        province: props.province,
                        town: props.town,
                        price: props.price,
                        author: props.author,
                        phoneNumber: props.phoneNumber,
                        showDelete: props.showDelete,
                        reported: props.reported});
        //this.setState(this.state);
    }
    
    showPhoneNumber(){
        if(this.state.textButton != "Buy now"){
            this.setState({textButton: "Buy now"})
            return;
        }
        this.setState({ textButton: this.state.phoneNumber});

    }
    render() {
        return (

            <div className="ad_tile">
                <div className="img">
                    <img src={ placeholder } alt="Generic placeholder image"/>
                </div>
                
                <div className={ this.state.reported && this.state.admin ? "" : "notDisplay"}>{this.state.reported }</div>
                <div className="content">
                    <div className="info primary">
                        <div className="line">
                            <div className="title">
                                { this.state.title }
                            </div>
                            <button onClick={ () => this.props.deleteAd(this.state.id)} class={this.state.showDelete ? "btn btn-outline-success my-2 my-sm-0": "notDisplay"} type="submit">Delete</button>
                            <button onClick={ () => this.props.reportAd(this.state.id)} class="btn btn-outline-success my-2 my-sm-0" type="submit">Report</button>
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
                                <b>{ this.state.province } { this.state.town != null ? this.state.town : null } </b>
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
                            <button onClick={() =>this.showPhoneNumber()} class="btn btn-outline-success my-2 my-sm-0" type="submit" >{this.state.textButton}</button>
                        </div>
                    </div>
                </div>
            </div>

         );
    }
}

export default Ad;
