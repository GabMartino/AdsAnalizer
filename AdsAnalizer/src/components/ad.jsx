import React, { Component } from 'react';


class Ad extends Component {
    state = { 
        src: "https://picsum.photos/200",
        body: this.props.body
     }
    constructor(props){
        super(props);
    }
    render() { 
        return ( 
            <div className="media m-2">
                <img className="mr-3" src={this.state.src} alt="Generic placeholder image"/>
                <div className="media-body">
                    <h5 className="mt-0">Media heading</h5>
                    {this.state.body}
                </div>
            </div>
         );
    }
}
 
export default Ad;