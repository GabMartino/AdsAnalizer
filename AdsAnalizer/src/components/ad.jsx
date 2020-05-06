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

        this.closeExpand = React.createRef();

    }

    componentWillReceiveProps(props){
        this.setState({ item: props.item,
                        admin: props.admin,
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
                                <b>{ this.state.province } { this.state.town != null ? this.state.town : null } </b>
                            </div>
                            <div className="author">
                                <img src={ user } />
                                {this.state.author ? this.state.author.name : null }
                            </div>
                        </div>
                        <div className="line">
                            <div className="price">
                                {this.state.price}
                            </div>
                            <button onClick={() =>this.expand()} className="btn btn-outline-success my-2 my-sm-0" type="submit" >{this.state.textButton}</button>
                        </div>
                    </div>
                </div>
                <div ref={ this.closeExpand } className={ this.state.isExpanded ? "expandedAd_container expand" : "expandedAd_container" }>
                    <ExpandedAd 
                                deleteAd = { this.props.deleteAd}
                                reportAd = { this.props.reportAd}
                                item = { this.state.item }// this should replace all the data below, for future refactoring
                                title={ this.state.title } 
                                body={ this.state.body } 
                                userLoggedId = {this.props.userLoggedId}
                                region={ this.state.region } 
                                province={ this.state.province } 
                                town={ this.state.town } 
                                price={ this.state.price } 
                                author={ this.state.author } 
                                phoneNumber={ this.state.phoneNumber }
                                deleteAd = { this.props.deleteAd}
                                reportAd = { this.props.reportAd }
                                admin = { this.props.admin }
                                reported = { this.props.reported }
                                id = { this.props.id}
                                showDelete = { this.props.showDelete }
                                />
                </div>
            </div>

         );
    }
}

export default Ad;
