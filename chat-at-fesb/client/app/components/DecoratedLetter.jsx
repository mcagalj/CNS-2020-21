import React from 'react'

const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'    
}

export default ({ color='#ffa500', size=40, letter }) =>
    <div style={style}>  
        <svg height={size} width={size}>
            <rect x='0' y='0' width={size} height={size} fill={color} />
            <text 
                x='50%' y='50%' 
                fill='white' 
                textAnchor='middle' 
                alignmentBaseline='middle'
                // fontWeight='bold'
            >
                {letter.toUpperCase()}
            </text>
        </svg>
    </div>


