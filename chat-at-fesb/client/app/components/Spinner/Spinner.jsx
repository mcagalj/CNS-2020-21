import React from 'react'
import './Spinner.scss'

const Spinner = props => {
    const { 
        width, 
        border,
        gap,
        text
    } = props

    const styleSpinner = {
        margin: gap ? gap : '1em',
        [border ? 'borderWidth' : null]: border,
        [border ? 'borderWidthTop' : null]: border,
        [width ? 'width' : null]: width,
        [width ? 'height' : null]: width        
    }
    
    return (
        <div className={'Spinner__container'}>
            <div className='Spinner' style={styleSpinner}/>
            <div className='Spinner__text'>{text}</div>
        </div>
    )
}


const SimpleSpinner = props =>
    <Spinner {...props}
        gap={'0'}
    />


export {
    Spinner as default,
    SimpleSpinner
}    