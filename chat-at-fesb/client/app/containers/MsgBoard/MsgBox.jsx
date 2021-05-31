import React, {Component} from 'react'

export default class extends Component {

    componentDidMount() {
        this.end.scrollIntoView()
    }

    componentDidUpdate() {
        this.end.scrollIntoView()
    }

    render() {
        return (
            <div className='MsgBoard__msg-box' ref>  
                { this.props.children }
                <div ref={(el) => this.end = el}/>  
            </div>
        )      
    }
}