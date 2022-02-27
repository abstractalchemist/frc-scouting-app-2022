import React from "react";

class Checkbox extends React.Component{
    constructor(props){
        super(props);
        this.changeState = this.changeState.bind(this);
    }
    
    changeState(){
        this.props.changeState(this.props.place);
    }

    render(){
        return(
            <div>
                <label> {this.props.label}
                    < input type="checkbox" checked={this.props.checked} id={this.props.label} onChange={this.changeState} />
                </label>
            </div>
        )
    }
}

export default Checkbox;