import React, { Component } from 'react';




class ExpandedAd extends Component {

    state = {
		showDelete: this.props.showDelete,
    }

    constructor(props){
        super(props);

    }
	componentWillReceiveProps(props){
        this.setState({
						showDelete: props.showDelete
                      });
    }

    render() {
        return (

            <div className="expandedAd">
				<div className="title">
					<p>{ this.props.title }</p>
					<div className="buttons">
						<button onClick={ () => this.props.deleteAd(this.props.id)} className={this.state.showDelete ? "delete": "notDisplay"} type="submit">Delete</button>
						<button onClick={ () => this.props.reportAd(this.props.id, true)} className={!this.props.admin && this.props.author && this.props.author.userId != this.props.userLoggedId? "report" : "notDisplay"} type="submit">Report</button>
						<button onClick={ () => this.props.reportAd(this.props.id, false)}
									className={this.props.admin ? (this.props.reported > 0 ? "report" : "notDisplay") : "notDisplay"}
									type="submit">Remove Report</button>
						<div>
							{this.props.admin && this.props.reported ? this.props.reported : null }
						</div>
					</div>
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
				{ this.props.item.features.map( (features) => {
					if( features.name != "Prezzo"){
						return <div className="field">
									<p className="label">{features.name}</p>
									<p>{ features.value }</p>
								</div>
					}

				})}
				<div className="field">
					<p className="label">CONTACT</p>
					<p>{ this.props.phoneNumber }</p>
				</div>
            </div>

         );
    }
}

export default ExpandedAd;
