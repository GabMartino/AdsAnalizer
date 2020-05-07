import React, { Component } from 'react';
import { Chart } from "react-google-charts";
import consts from '../consts';
import { Popover } from 'react-bootstrap';

class GeoChart extends Component {

    state = {  
        data: Array()
    }
    constructor(props){
        super(props);
    }
    componentWillReceiveProps(props){

        if(props.regionSelected){
            var i = 0;
            let data = [];
            while( i < this.props.xaxis.length){
                data.push([props.xaxis[i], parseFloat(props.yaxis[i])]);
                i++;
            }
            if( props.kind == "AVG"){
              data.unshift(['City', 'Average price']);
            }else{
              data.unshift(['City', 'Number Of Ads']);
            }

            console.log(data);
            this.setState({data: data});
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
                        chartType="GeoChart"
                        loader={<div>Loading Chart</div>}
                        data={ this.state.data }
                        
                        options={{
                          pieSliceText: 'label',  
                          region: 'IT',
                          resolution:"provinces",
                          displayMode: 'markers',
                          colorAxis: { colors: ['green', 'blue'] },
                        }}
                        mapsApiKey="AIzaSyBW_qm2BguF0TNxJyPEe3DS74zTouidFkU"
                    />
                </div>
          
         );
    }
}
 
export default GeoChart;