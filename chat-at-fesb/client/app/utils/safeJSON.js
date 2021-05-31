/**
 * Try to stringify a given object and return `undefined`
 * if JSON.stringify fails; confines potential SyntaxError 
 * exceptions.
 * 
 * @param {*} json 
 */
function JSONstringify(json) {
    let stringified = undefined

    try {
        stringified = JSON.stringify(json)
    } catch(error) {
        console.error(error, 'JSON.stringify error')
    }

    return stringified
}


/**
 * Try to parse the given object and return `undefined`
 * if JSON.parse fails;  confines potential SyntaxError 
 * exceptions.
 * 
 * @param {*} json 
 */
function JSONparse(json) {
    let parsed = undefined

    try {
        parsed = JSON.parse(json)
    } catch(error) {
        console.error(error, `JSON.parse error`)
    }

    return parsed
}

export {
    JSONstringify,
    JSONparse
}