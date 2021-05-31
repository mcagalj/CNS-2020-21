function loadKey(id, state) {
    console.log(state)
    if (!(id in state)) return undefined
    const { symmetric: { key } } = state[id]
    return key
}

// function loadCredentials(id, state) {
//     if (!(id in state)) return {
//         key: undefined,
//         msgCount: undefined
//     }
//     const { symmetric: { key }, msgCount } = state[id]
//     return {
//         key,
//         msgCount
//     }
// }

export { loadKey }