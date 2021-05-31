import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class extends Component {

    static propTypes = {
        placeholder: PropTypes.string,
        buttonText: PropTypes.string,
        sendMsg: PropTypes.func.isRequired
    }

    static defaultProps = {
        placeholder: 'Type your message',
        buttonText: 'Send'
    }

    state = { message: '' }

    handleChange = event => {
        this.setState({ message: event.target.value })
    }

    handleKeyPress = event => {
        if(event.key == 'Enter') {
            event.preventDefault()
            this.handleButtonClick()
        }        
    }

    handleButtonClick = () => {  
        const { message } = this.state
        if (message) {
            this.props.sendMsg(message)
            this.setState({ message: '' })
        }           
    }

    render() {
        const { 
            placeholder, 
            buttonText 
        } = this.props
        
        const { message } = this.state
        
        return (
            <div className='MsgBoard__input-box'>
                <input 
                    className='MsgBoard__input'  
                    placeholder={placeholder}
                    value={message}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                />

                <div 
                    className='MsgBoard__button'
                    onClick={this.handleButtonClick}
                >                    
                    {buttonText}
                </div>
            </div>            
        )
    }
}
