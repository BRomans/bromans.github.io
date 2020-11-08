import React, { Component } from 'react'

class Widecard extends Component { 
    render () {
        return (
            <div className="widecard">
                <div className="compdet">
                    <h3>{this.props.title}</h3>
                    <h4 className="second-text">{this.props.where}</h4>
                    <h4 className="second-text">{this.props.from} - {this.props.to}</h4>
                    <p className="card-details">{this.props.details}</p>

                </div>
            </div>
        )
    }
}

export default Widecard