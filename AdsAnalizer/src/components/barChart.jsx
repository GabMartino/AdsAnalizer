import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import consts from '../consts';

class BarChart extends Component {

    state = {  
        data: null
    }
    constructor(props){
        super(props);
        this.handleSelection = this.handleSelection.bind(this);
    }
    componentWillReceiveProps(){
        this.setState({callBack: this.props.callStat});
        var i = 0;
        var data = null;
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
        this.forceUpdate();
          
    }

    handleSelection(rowIndex){
     
        this.props.callStat(consts.STAT_PRICE_DISTR,this.props.xaxis[rowIndex]);
        

    }
    render() { 
        return ( 
                <div className={"my-pretty-chart-container"}>
                    <Chart
                    chartType={ this.props.kindOfChart ? this.props.kindOfChart : "Bar"} 
                    data={this.state.data}
                    options={{
                        legend:  {position: 'none'},
                        title: this.props.title
                    }}
                    //width="100%"
                    //height="500px"
                    chartEvents= {[{
                            eventName: "select",
                            callback: ({chartWrapper}) => {
                                this.handleSelection(chartWrapper.getChart().getSelection()[0].row);
                               
                            }
                        }]}
                    />
                </div>
          
         );
    }
}
 
export default BarChart;