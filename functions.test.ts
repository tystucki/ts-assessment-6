const {shuffleArray} = require('./utils')

describe('shuffleArray should', () => {
    test('check to see if length is the same after running the function', () => {
        let arr = [1,2,3,4,5] 
        let result = shuffleArray(arr)
        expect(arr.length).toBe(result.length)
    })

    test('return array with the same items', () => {
        //create array
        //run through the function
        //check to make sure all original values are included in the new array
        
        let arr = [1,2,3,4,5] 
        let result = shuffleArray(arr)

        let myVar = true

        for(let i = 0; i < result.length; i++){
            if(arr.includes(result[i]) === false){
                myVar = false
                return
            }
        }
        expect(myVar).toBe(true)
    })
})


module.exports = {
    shuffleArray
}