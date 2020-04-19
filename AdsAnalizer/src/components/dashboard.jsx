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
            if(!this.toggleMyAddsRef.current.classList.contains("checked")){
                this.toggleMyAddsRef.current.classList.add("checked");
                this.toggleMyAddsRef.current.checked = true;
                this.props.applyFilter( consts.FILTER_MY_ADS );
            }else{
                this.toggleMyAddsRef.current.classList.remove("checked");
                this.toggleMyAddsRef.current.checked = false;
                this.props.applyFilter( null );
            }
		} );

		this.toggleFlaggedRef.current.addEventListener( "click", () => {

            if(!this.toggleFlaggedRef.current.classList.contains("checked")){
                this.toggleFlaggedRef.current.classList.add("checked");
                this.toggleFlaggedRef.current.checked = true;
                this.props.applyFilter( consts.FILTER_FLAGGED );
            }else{
                this.toggleFlaggedRef.current.classList.remove("checked");
                this.toggleFlaggedRef.current.checked = false;
                this.props.applyFilter( null );
            }

		} );

		this.toggleStatisticsRef.current.addEventListener( "click", () => {
			this.props.showStatistics( true );
		} );

	}

    render() {
        return (
            <div id="dashboard" className={ this.props.userIsLogged ? "show" : "" }>
				<div className={!this.props.isAdmin ? "switch_wrapper" : "notDisplay"}>
					<p>Mostra i miei annunci</p>

					<input ref={ this.toggleMyAddsRef } type="radio" name="filters" id="switchMyAdds" className="switch" />
					<label for="switchMyAdds"></label>
				</div>
				<div className={this.props.isAdmin ? "switch_wrapper" : "notDisplay"}>
					<p>Mostra annunci segnalati</p>

					<input ref={ this.toggleFlaggedRef } type="radio" name="filters" id="switchFlagged" className="switch" />
					<label for="switchFlagged"></label>
				</div>
				<button ref={ this.toggleStatisticsRef } class="btn btn-primary statistics" type="button" aria-expanded="false" aria-controls="collapseExample">Statistiche</button>
            </div>
        );
    }
}

export default Dashboard;
