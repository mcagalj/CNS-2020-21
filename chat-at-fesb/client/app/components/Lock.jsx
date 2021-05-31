import React from 'react'

const style = {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    marginRight: '0.5rem'
}

export default ({ open=true }) => {
    let color = '#ff6961'
    let lock = <path d='M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 17h-8v-6h2v-2c0-1.103-.897-2-2-2s-2 .897-2 2v1h-1v-1c0-1.656 1.343-3 3-3s3 1.344 3 3v2h5v6z'/>

    if (!open) {
        color = '#33d9b2'
        lock = <path d='M14 9v2h-4v-2c0-1.104.897-2 2-2s2 .896 2 2zm10 3c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-8-1h-1v-2c0-1.656-1.343-3-3-3s-3 1.344-3 3v2h-1v6h8v-6z'/>
    }
    
    return (
        <div style={style}>  
            <svg width='24' height='24' viewBox='0 0 24 24' fill={color}>
                {lock}
            </svg>    
        </div>
    )
}