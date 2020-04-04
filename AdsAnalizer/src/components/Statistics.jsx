import React, { Component } from 'react';
import axios from 'axios';

class Statistics extends Component {


    constructor(props){

        super(props);
        

    }

    state = {
        dataset: this.props.dataset,
        meanValue: 0,
    }
    componentWillReceiveProps(){
        this.setState({dataset: this.props.dataset});
        console.log(this.state.dataset);
        if(this.props.dataset != null ){
            var totalPrice = 0;
            for(var i = 0; i< this.props.dataset.length; i++){
                totalPrice += this.props.dataset[i].features[0].value;
            }
            this.setState({meanValue: totalPrice/this.props.dataset.length});
            console.log(totalPrice);
        }
        
        
    }
    render() {

        return (
            <form className="statistics">
                <b>Statistics</b>
                <p>Mean Value</p>>
                {this.state.meanValue}
            </form>


         );

    }



}

export default Statistics;
