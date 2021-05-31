import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'


const Container = ({ direction, children }) =>
    <div className={`MsgBoard__msg-container${direction}`}>
        {
            React.cloneElement(
                React.Children.only(children), 
                {direction}
            )                
        }
    </div>

const Cloud = ({ direction, children }) =>
    <div className={`MsgBoard__msg-cloud${direction}`}>
        {
            React.Children.map(children, child => 
                React.cloneElement(child, {direction})
            )
        }
    </div>

const Sender = ({ direction, children: sender, color }) => {
    const style = direction === '--in' ? ({color}) : {}
    return (
        <div 
            style={style} 
            className={`MsgBoard__msg-sender${direction}`}
        >
            {sender}
        </div>
    )
}

const Content = ({ children: content }) =>
    <div className='MsgBoard__msg-content'>
        {content}
    </div>

const Time = ({ children: time }) =>
    <div className='MsgBoard__msg-time'>
        {time}
    </div>

    
const Msg = ({ 
    outgoing, 
    nickname,
    color, 
    timestamp, 
    banner, 
    content 
}) => {
    const direction = `--${outgoing ? 'out' : 'in'}`
    content = content ? content : banner
    let time = new Date(timestamp)                        
    time = `${time.getHours()}:${`0${time.getMinutes()}`.slice(-2)}`                           

    return (  
        <Container direction={direction}>
            <Cloud>
                <Sender color={color}>{nickname}</Sender>
                <Content>{content}</Content>
                <Time>{time}</Time>
            </Cloud>
        </Container>
    )
}

Msg.propTypes = {
    outgoing: PropTypes.bool.isRequired,
    nickname: PropTypes.string,
    timestamp: PropTypes.number.isRequired,
    content: PropTypes.string
}

export default Msg