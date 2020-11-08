import React, { Component } from 'react';
import Social from '../components/Social';

class Contact extends Component {
    render() {
        return (
            <div className="right-content">
                <h1 className="subtitle">Contact Me</h1>
                <h3>Email: michele.romani.gzl0@gmail.com</h3>
                <h4>Or write to me on any of my social media and let me know what you think of my portfolio!</h4>
                
                <Social />
            </div>
        )
    }
}

export default Contact