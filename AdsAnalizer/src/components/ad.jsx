import React, { Component } from 'react';

import ExpandedAd from './ExpandedAd.jsx';

import placeholder from '../assets/images/placeholder.png';
import location from '../assets/icons/pin.png';
import user from '../assets/icons/user.png';




class Ad extends Component {

    state = {
        item : this.props.item,
        admin: false,
        textButton: "Expand",
        showDelete: this.props.showDelete,
        reported: this.props.reported,
        isExpanded: false
     }

    constructor(props){

        super(props);

        this.closeExpand = React.createRef();

    }

    componentWillReceiveProps(props){
        this.setState({ item: props.item,
                        admin: props.admin,
                        showDelete: props.showDelete,
                        isExpanded: false,
                        reported: props.reported});
        //this.setState(this.state);
    }

    componentDidMount(){
        this.initListeners();
    }

    initListeners(){

        this.closeExpand.current.addEventListener( "click", (event) => {
            if( event.target === this.closeExpand.current ){
                this.expand();
            }
        } )

    }

    expand(){

        this.setState({
            isExpanded: !this.state.isExpanded
        });

    }


    render() {
        return (

            <div className={ this.props.item.advertiser.userId && this.props.item.advertiser.userId == this.props.userLoggedId ? "ad_tile my_add" : "ad_tile "}>
                <div className="img">
                    <img src={ placeholder } alt="Generic placeholder image"/>
                </div>


                <div className="content">
                    <div className="info primary">
                        <div className="line">
                            <div className="title">
                                { this.state.item.subject }
                            </div>

                        </div>
                        <div className="line">
                            <div className="description">
                                { this.state.item.body }
                            </div>

                        </div>
                    </div>

                    <div className="info secondary">
                        <div className="line">
                            <div className="location">
                                <img src={ location } />
                                <b>{ this.props.item.geo ? (this.props.item.geo.province ? this.props.item.geo.province.shortName : null) : null }  { this.props.item.geo ? (this.props.item.geo.town ? this.props.item.geo.town.value : null ) : null } </b>
                            </div>
                            <div className="author">
                                <img src={ user } />
                                {this.state.item.advertiser ? this.state.item.advertiser.name : null }
                            </div>
                        </div>
                        <div className="line">
                            <div className="price">
                                {Array.isArray(this.state.item.features) && this.state.item.features.length ? this.state.item.features[0].value : null}
                            </div>
                            <button onClick={() =>this.expand()} className="btn btn-outline-success my-2 my-sm-0" type="submit" >{this.state.textButton}</button>
                        </div>
                    </div>
                </div>
                <div ref={ this.closeExpand } className={ this.state.isExpanded ? "expandedAd_container expand" : "expandedAd_container" }>
                    <ExpandedAd
                                deleteAd = { this.props.deleteAd}
                                reportAd = { this.props.reportAd}
                                features = { this.state.item.features }// this should replace all the data below, for future refactoring
                                title={ this.state.item.subject }
                                body={ this.state.item.body }
                                userLoggedId = {this.props.userLoggedId}
                                region={ this.state.item.geo.region.name ? this.state.item.geo.region.name : this.state.item.geo.region.value}
                                province={ this.state.item.geo.province.shortName  }
                                town={ this.state.item.geo.town.value }
                                price={ this.state.item.features[0].value }
                                author={ this.state.item.advertiser.name }
                                phoneNumber={ this.state.item.advertiser.phone }
                                deleteAd = { this.props.deleteAd}
                                reportAd = { this.props.reportAd }
                                admin = { this.props.admin }
                                reported = { this.props.reported }
                                id = { this.state.item._id}
                                showDelete = { this.props.showDelete }
                                />
                </div>
            </div>

         );
    }
}

export default Ad;
