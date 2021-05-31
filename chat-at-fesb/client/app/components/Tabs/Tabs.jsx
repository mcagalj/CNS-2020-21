import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Tabs.scss'

class Tabs extends Component {
    static propTypes = {
        children: PropTypes.array.isRequired
    }

    state = {
        activeIndex: 0
    }

    _renderNavBar = () =>
        <div>
            <ul className='Tabs__nav-bar'>
                {
                    React.Children.map(this.props.children, (child, index) => {
                        const className = index === this.state.activeIndex ? ( 
                            'Tabs__nav-bar--active' 
                        ) : (
                            ''
                        )
                        
                        return (
                            <li key={index} 
                                className={className}
                                onClick={() => this.setState({ activeIndex: index })}
                            >
                                {child.props.label}
                            </li> 
                        )
                    })
                }
            </ul>
        </div>

    _renderChildren = () => this.props.children[this.state.activeIndex]

    render() {
        return (
        <div className='Tabs'>
            {this._renderNavBar()}
            {this._renderChildren()}
        </div>  
        )
    }
}

const Tab = ({ children }) => 
    <div className='Tabs__tab'>
        {children}
    </div>

Tab.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
}

export {
    Tabs as default,
    Tab
}