import React, { Component } from 'react';
import Widecard from '../components/Widecard';
import curriculum from '../text/curriculum.json'

const study = curriculum.study.map(function (item){
    return <Widecard title={item.title} where={item.where} from={item.from} to={item.to} details={item.details} />
});
const work = curriculum.work.map(function (item){
    return <Widecard title={item.title} where={item.where} from={item.from} to={item.to} details={item.details} />
});

class Curriculum extends Component {
    
    render() {
        return (
            <div className="right-content">
                <h1 className="subtitle">My Curriculum Vitae</h1>
                <br></br>
                
                <h2>Study Career</h2>
                {study}
                <br></br>

                <h2>Work Career</h2>
                {work}
            </div>
        )
    }
}

export default Curriculum