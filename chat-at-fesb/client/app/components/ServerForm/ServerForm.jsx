import React, {Component} from 'react'
import Spinner from 'app/components/Spinner/Spinner.jsx'
import './ServerForm.scss'

class ServerForm extends Component {
    constructor(props) {
        super(props)        
        this.state = {
            host: props.defaults.host,
            port: props.defaults.port,
            nickname: undefined
        }
    }

    _handleHostChange = event => this.setState({ host: event.target.value})
    _handlePortChange = event => this.setState({ port: event.target.value })
    _handleNickChange = event => this.setState({ nickname: event.target.value })
    _handleButtonClick = () => this.props.onConnect(this.state)
    _handleKeyPress = event => {
        if(event.key == 'Enter') {
            this._handleButtonClick()
            event.preventDefault()
        }        
    }

    render() {
        const { 
            connecting, 
            hostText, 
            portText, 
            nickText, 
            buttonText 
        } = this.props
        
        const spinnerText = `Connecting to ${this.state.host}:${this.state.port}...`
        
        return ( 
            <div className='ServerForm'>
                <input 
                    className='ServerForm__host' 
                    placeholder={hostText} 
                    maxLength='30' 
                    tabIndex='0' 
                    onChange={this._handleHostChange} 
                    onKeyPress={this._handleKeyPress}
                />
                
                <input 
                    className='ServerForm__port' 
                    type='number' 
                    placeholder={portText} 
                    onChange={this._handlePortChange} 
                    onKeyPress={this._handleKeyPress}
                />

                <input 
                    className='ServerForm__nickname' 
                    placeholder={nickText} 
                    maxLength='15' 
                    onChange={this._handleNickChange} 
                    onKeyPress={this._handleKeyPress}
                />

                <div
                    className='ServerForm__button' 
                    onClick={this._handleButtonClick}
                >
                    {buttonText}
                </div>


                { connecting && 
                    <Spinner
                        width={'50px'}
                        border={'4px'}
                        text={spinnerText}
                    />
                }

            </div>         
        )
    }
}

export default ServerForm