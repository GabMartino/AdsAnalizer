import React, { Component } from 'react';

import PieChart from './pieChart';


class ExpandedUser extends Component {

    state = {
    }

    constructor(props){
        super(props);

	}
    render() {
        return (

            <div className="expandedAd">
				<div className="title">
					<p>{ this.props.name}</p>
				</div>
				<PieChart
					kind = "CAT"
					name = "Category distribution of ads"
					data = {this.props.data ? this.props.data.dataOrganizedForCategory : null}
					/>
				<PieChart
					kind = "PROV"
					name = "Province distribution of ads"
					data = {this.props.data ? this.props.data.dataOrganizedForProvince : null}
				/>
				<div className="field">
					<p className="label">INFORMATION</p>
					<p>Number of ads: { this.props.numAds }</p>
					<p>Max price: { this.props.data ? this.props.data.max_price : null }</p>
					<p>Min price: { this.props.data ? this.props.data.min_price : null }</p>
				</div>
				
				<div className="field">
					<p className="label">CONTACT</p>
					<p>{ this.props.phone }</p>
				</div>
            </div>

         );
    }
}

export default ExpandedUser;
