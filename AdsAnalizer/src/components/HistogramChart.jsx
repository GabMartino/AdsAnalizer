import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import consts from '../consts';

class HistogramChart extends Component {
    

    state = {  
        data: Array()
    }
    constructor(props){
        super(props);
      
    }
    componentWillReceiveProps(props){
        if(props.data){
            var data = []
            data = props.data.price_distribution[0].map( object => {
                return [object._id, object.count]
            });
           
            data.unshift(['Price', 'Number Of Ads']);
            this.setState({data: data});
            //this.forceUpdate();
            console.log(data);
        }
    }
    render() { 
        return ( 
                <div className={"my-pretty-chart-container"}>
                    <Chart
                        chartType="Bar"
                        data={this.state.data}
                        options={{
                            legend:  {position: 'none'},
                            title: this.props.title,
                        
                        }}
                    />
                    <div>
                        Information
                        <div>
                            {"Min Price" +   this.props && this.props.data ? this.props.data.min : null}
                        </div>
                        <div>
                            {"Max Price" + this.props &&  this.props.data ? this.props.data.max : null}
                        </div>
                        <div>
                            {"Average Price" + this.props &&  this.props.data ? this.props.data.avg : null}
                        </div>
                        <div>
                           { "Number of Ads" + this.props &&  this.props.data ? this.props.data.count : null}
                        </div>
                    </div>
                </div>
          
         );
    }
}
 
export default HistogramChart;