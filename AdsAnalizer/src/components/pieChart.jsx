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
    componentWillReceiveProps(){
        /* this.setState({callBack: this.props.callStat});
        var i = 0;
        let data = null;
        if(this.props.regionSelected != undefined)
            data = Array([!this.props.regionSelected ? "Regions" : "Provinces", this.props.nameSeries]);
        else
            data = Array(["Prices", this.props.nameSeries]);
        
        while(i < this.props.xaxis.length){
            data.push(Array(this.props.xaxis[i], parseFloat(this.props.yaxis[i])));
            i++;
        }            
       
        //data = google.visualization.arrayToDataTable(data, true);
        this.setState({data: data});
          */
    }

    handleSelection(rowIndex){
        this.props.callStat(consts.STAT_PRICE_DISTR,this.props.xaxis[rowIndex]);
        console.log(this.props.xaxis[rowIndex]);

    }
    render() { 
        return ( 
                <div className={"my-pretty-chart-container"}>
                    <Chart
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                      ['Task', 'Hours per Day'],
                      ['Work', 11],
                      ['Eat', 2],
                      ['Commute', 2],
                      ['Watch TV', 2],
                      ['Sleep', 7],
                    ]}
                    options={{
                      title: 'My Daily Activities',
                    }}
                    rootProps={{ 'data-testid': '1' }}
                    />
                </div>
          
         );
    }
}
 
export default PieChart;