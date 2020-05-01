import React, { Component } from 'react';

import ExpandedAd from './ExpandedAd.jsx';

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

        this.closeExpand = React.createRef();

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
                            <div className="buttons">
                                <button onClick={ () => this.props.deleteAd(this.state.id)} className={this.state.showDelete ? "delete": "notDisplay"} type="submit">Delete</button>
                                <button onClick={ () => this.props.reportAd(this.state.id, true)} className={!this.props.admin && this.props.author && this.props.author.userId != this.props.userLoggedId? "report" : "notDisplay"} type="submit">Report</button>
                                <button onClick={ () => this.props.reportAd(this.state.id, false)}
                                            className={this.props.admin ? (this.props.reported > 0 ? "report" : "notDisplay") : "notDisplay"}
                                            type="submit">Remove Report</button>
                                <div>
                                    {this.state.admin && this.state.reported ? this.state.reported : null }
                                </div>
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
                    <ExpandedAd title={ this.state.title } body={ this.state.body } region={ this.state.region } province={ this.state.province } town={ this.state.town } price={ this.state.price } author={ this.state.author } phoneNumber={ this.state.phoneNumber }/>
                </div>
            </div>

         );
    }
}

export default Ad;
