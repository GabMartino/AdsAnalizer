import React, { Component } from 'react';
import Ad from './ad';

class Feed extends Component {
    state = { 
        ads: [
            {id: 0, value: 0},
            {id: 0, value: 0},
            {id: 0, value: 0},
            {id: 0, value: 0},
            {id: 0, value: 0}

        ]
     }
    render() { 
        return (  
            <div>
                { this.state.ads.map( ad => <Ad
                
                />)
            }
            </div>
            

        );
    }
}
 
export default Feed;