import React, { Component } from 'react';




class ExpandedAd extends Component {

    state = {

     }

    constructor(props){
        super(props);

    }


    render() {
        return (

            <div className="expandedAd">
				<div className="title">
					<p>{ this.props.title }</p>
				</div>
				<div className="field">
					<p className="label">LOCATION</p>
					<p>{ this.props.region + " - " + this.props.province + " - " + this.props.town }</p>
				</div>
				<div className="field">
					<p className="label">PRICE</p>
					<p>{ this.props.price }</p>
				</div>
				<div className="field">
					<p className="label">DESCRIPTION</p>
					<p>{ this.props.body }</p>
				</div>
				<div className="field">
					<p className="label">CONTACT</p>
					<p>{ this.props.phoneNumber }</p>
				</div>
            </div>

         );
    }
}

export default ExpandedAd;
