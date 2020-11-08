import React, {Component} from 'react';
import NavItem from './NavItem'

class Navbar extends Component {
    constructor (props) {
        super(props);
        this.state = {
            'NavItemActive': ''
        }
    }

    activeItem = (x) => {
        if(this.state.NavItemActive.length > 0) {
            document.getElementById(this.state.NavItemActive).classList.remove('active');
        };

        this.setState({ 'NavItemActive':x }, () => {
            document.getElementById(this.state.NavItemActive).classList.add('active');
        });
    }
    
    render() {
        return (
            <nav className="Nav">
                <ul>
                <NavItem item="Home" tolink="/"  isActive={this.activeItem}></NavItem>
                <NavItem item="About" tolink="/about" isActive={this.activeItem}></NavItem>
                <NavItem item="Curriculum" tolink="/cv" isActive={this.activeItem}></NavItem>
                <NavItem item="Projects" tolink="/projects" isActive={this.activeItem}></NavItem>
                <NavItem item="Contact" tolink="/contact" isActive={this.activeItem}></NavItem> 
                </ul>
            </nav>
        )
    }
}

export default Navbar;