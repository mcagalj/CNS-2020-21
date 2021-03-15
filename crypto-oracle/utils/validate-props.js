const assert = require('assert')

const errPrefix = 'Validation error:'

module.exports = (expected, provided) => {
    assert.ok(
        provided, 
        `${errPrefix} the object does not exist`
    )

    assert.ok(
        Array.isArray(expected), 
        `${errPrefix} argument expected must be an array`
    )
        
    expected.forEach(property => {        
        const { name, type, instance, optional } = property

        if (optional && typeof provided[name] === 'undefined') return

        assert.ok(
            typeof provided[name] !== 'undefined',
            `${errPrefix} ${name} not provided`
        )
        
        if (type)
            assert.ok(
                typeof provided[name] === type, 
                `${errPrefix} typeof ${name} should be a ${type}`
            )
        
        if (instance) 
            assert.ok(
                provided[name] instanceof instance, 
                `${errPrefix} ${name} should be instance of ${instance}`
            )
    })
}