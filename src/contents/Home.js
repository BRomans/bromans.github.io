import React, { Component } from 'react';
import ReactTypingEffect from 'react-typing-effect';
import profileLogo from '../img/justaguy.png';
import Social from '../components/Social';

class Home extends Component {
    render() {
        return (
            <div className="right-content home">
                <img src={profileLogo} className="profile-logo"></img>
                <ReactTypingEffect className="type-effect" text={['I am Michele Romani', 'A developer', 'A designer', 'A thinker']} 
                                    speed={100} eraseDelay={500}/>
                <Social />
            </div>
        )
    }
}

export default Home