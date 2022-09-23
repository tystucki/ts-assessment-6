const {shuffleArray} = require('./utils')

describe('shuffleArray should', () => {
    test('check that shuffleArray returns an array', () => {
        let shuffledArray = shuffleArray('array')
        expect(typeof shuffledArray).toBe('array')
    })

    test('should check thet it returns an array of the same length as the argument sent in', () => {
        let arraySent = shuffleArray('array')
        expect(typeof shuffleArray)
    })
})


module.exports = {
    shuffleArray
}