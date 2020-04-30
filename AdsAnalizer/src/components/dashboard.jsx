import React, { Component } from 'react';
import consts from '../consts';
import axios from 'axios';

class Dashboard extends Component {

    state = {
        isAdmin: false,
        numberOfAds: null,
        numberOfUsers: null,
    }

    constructor(props){

        super(props);

		//refs
		this.toggleMyAddsRef = React.createRef();
        this.toggleFlaggedRef = React.createRef();
		this.toggleStatisticsRef = React.createRef();
        this.fetchCounters = this.fetchCounters.bind(this);
    }

    async componentDidMount(){
        this.initListeners();
       
    }
    async componentWillReceiveProps(props){
       this.setState({isAdmin: props.isAdmin});
       if(props.isAdmin){
            console.log("............");
            let response = await this.fetchCounters(1);
            if( response )
                var value = parseInt(response.value);
                this.setState({ numberOfUsers: value});
            response = await this.fetchCounters(2);
            if( response )
                var value = parseInt(response.value);
                this.setState({ numberOfAds: value});
        }
    }
    async fetchCounters(value) {
        let result = null;
        await axios.get('http://'+this.props.webServerIP+':'+this.props.webServerPort+'/counters/'+value,{
            withCredentials: true,
        }).then( (response) =>{
                if(response.status == 200){
                    result = response.data;
                }else{
                    console.log("Something's gone wrong");
                }
            
        }).catch(function (error) {
            console.error(error);
        });
        return result;
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
					<label htmlFor="switchMyAdds"></label>
				</div>
				<div className={this.props.isAdmin ? "switch_wrapper" : "notDisplay"}>
					<p>Mostra annunci segnalati</p>

					<input ref={ this.toggleFlaggedRef } type="radio" name="filters" id="switchFlagged" className="switch" />
					<label htmlFor="switchFlagged"></label>
				</div>
				<button ref={ this.toggleStatisticsRef } className="btn btn-primary statistics" type="button" aria-expanded="false" aria-controls="collapseExample">Statistiche</button>
                <div className={this.props.isAdmin ? "switch_wrapper" : "notDisplay"}>
					<p>Numero utenti</p>
					{this.state.numberOfUsers}
                    <p>Numero annunci</p>
					{this.state.numberOfAds}
				</div>
            </div>
        );
    }
}

export default Dashboard;
