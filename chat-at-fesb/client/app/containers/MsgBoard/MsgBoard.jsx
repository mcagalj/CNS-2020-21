import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { sendMsg } from 'app/redux/actions/clientActions.js'
import MsgBox from './MsgBox.jsx'
import Msg from './Msg.jsx'
import InputBox from './InputBox.jsx'
import './MsgBoard.scss'
import { Constants } from 'config'
const { MsgType } = Constants

class MsgBoard extends Component {

    static propTypes = {
        client: PropTypes.string.isRequired,
        messages: PropTypes.array.isRequired,
        sendMsg: PropTypes.func.isRequired 
    }

    handleSendMsg = content => this.props.sendMsg(content)

    render() {
        const { 
            client,
            messages,
            ui 
        } = this.props

        const _messages = messages.map((message, index) => 
            <Msg
                key={index}
                outgoing={!message.banner && client === message.id}
                color={ui[message.id] !== undefined ? ui[message.id]['color'] : '#444'}
                {...message}
            />
        )

        return (
            <div className='MsgBoard'>                
                <MsgBox>{_messages}</MsgBox>
                <InputBox sendMsg={this.handleSendMsg} />
            </div>
        )
    }
}

const mapStateToProps = ({ 
    client, 
    messages, 
    ui
}) => ({
    client: client.id,
    messages,
    ui
})
const MsgBoardContainer = connect(
    mapStateToProps, 
    { sendMsg }
)(MsgBoard)

export default MsgBoardContainer