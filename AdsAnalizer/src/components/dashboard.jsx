import React, { Component } from 'react';
import consts from '../consts';

class Dashboard extends Component {

    state = {

    }

    constructor(props){

        super(props);

		//refs
		this.toggleMyAddsRef = React.createRef();
		this.toggleFlaggedRef = React.createRef();
		this.toggleStatisticsRef = React.createRef();

    }

    componentDidMount(){
		this.initListeners();
    }

	initListeners(){

		this.toggleMyAddsRef.current.addEventListener( "click", () => {
			this.props.applyFilter( consts.FILTER_MY_ADS );
		} );

		this.toggleFlaggedRef.current.addEventListener( "click", () => {
			this.props.applyFilter( consts.FILTER_FLAGGED );
		} );

		this.toggleStatisticsRef.current.addEventListener( "click", () => {
			this.props.showStatistics( true );
		} );

	}

    render() {
        return (
            <div id="dashboard" className={ this.props.userIsLogged ? "show" : "" }>
				<div className="switch_wrapper">
					<p>Mostra i miei annunci</p>

					<input ref={ this.toggleMyAddsRef } type="checkbox" id="switchMyAdds" className="switch" />
					<label for="switchMyAdds"></label>
				</div>
				<div className="switch_wrapper">
					<p>Mostra annunci segnalati</p>

					<input ref={ this.toggleFlaggedRef } type="checkbox" id="switchFlagged" className="switch" />
					<label for="switchFlagged"></label>
				</div>
				<button ref={ this.toggleStatisticsRef } class="btn btn-primary statistics" type="button" aria-expanded="false" aria-controls="collapseExample">Statistiche</button>
            </div>
        );
    }
}

export default Dashboard;
