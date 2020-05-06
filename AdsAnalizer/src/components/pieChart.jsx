import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import consts from '../consts';

class PieChart extends Component {
    chartEvents = [
        {
          eventName: "select",
          callback({ chartWrapper }) {
            this.state.callStat(consts.STAT_PRICE_DISTR, chartWrapper.getChart().getSelection()[0].row);
            console.log("Selected ", chartWrapper.getChart().getSelection()[0].row);
          }
        }
      ];
    
    options = {
        legend:  {position: 'none'}
    }

    state = {  
        data: Array()
    }
    constructor(props){
        super(props);
        this.handleSelection = this.handleSelection.bind(this);
    }
    componentWillReceiveProps(props){
      if(props.data != null){
        
        var data = [];
        
        if(props.kind == "CAT"){
         
          data = props.data.map( elem => {
            return [elem.category_name, elem.count]
          });
         // data.unshift(['Category', 'Number of ads', 'Min Price', 'Max Price'])
          data.unshift(['Category', 'Number of ads']);
          console.log(data);
        }else{
          data = props.data.map( elem => {
            return [elem.province_name, elem.count]
          });
          //data.unshift(['Province', 'Number of ads', 'Min Price', 'Max Price'])
          data.unshift(['Province', 'Number of ads'])
        }
        this.setState({ data: data});
      }
       
    }

    handleSelection(rowIndex){
        this.props.callStat(consts.STAT_PRICE_DISTR,this.props.xaxis[rowIndex]);
        console.log(this.props.xaxis[rowIndex]);

    }
    render() { 
        return ( 
                <div className={"my-pretty-chart-container"}>
                    <Chart
                        width={'600px'}
                        height={'300px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={this.state.data}
                        options={{
                          title: this.props.name,
                          pieSliceText: 'label'
                        }}
                    
                    />
                </div>
          
         );
    }
}
 
export default PieChart;