import React from "react";
import Checkbox from "../Form/Checkbox";

class checkbox extends React.Component{
    constructor(props){
        super(props);
        this.changeState = this.changeState.bind(this);
    }

    changeState(){
        this.props.changeState(this.props.place)
    }

    render(){
        return(
            <div>
                <label> {this.props.label}
                    <input type="checkbox" onChange={this.changeState}></input>
                </label>
            </div>
        )
    }
}

export default Checkbox;