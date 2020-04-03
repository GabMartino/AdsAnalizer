import React, { Component } from 'react';

class AddPanel extends Component {


    constructor(props){

        super(props);

    }

    state = {


    }

    handleSubmit(){



    }
    render() {

        return (
            <form>
                <b>Add Panel</b>
                <div className="form-group">
                    <label for="exampleInputEmail1">Name</label>
                    <input type="text" className="form-control"  aria-describedby="emailHelp" placeholder="Title"/>
                </div>
                <div className="form-group">
                    <label for="exampleInputPassword1">Description</label>
                    <input type="text" className="form-control"  placeholder="Description"/>
                </div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                    <label className="form-check-label" for="exampleCheck1">Add</label>
                </div>
                <button type="submit" onClick={this.handleSubmit} className="btn btn-primary">Submit</button>
            </form>


         );

    }



}

export default AddPanel;
