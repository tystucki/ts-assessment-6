const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '000b09df1fec41abac7711c56abb5eea',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')
rollbar.error('error not working')

app.use(express.json())

app.get('/', (req, res) => {
    rollbar.log('HTML page loaded successfully')
    res.sendFile(path.join(__dirname, '/public/index.html'))

})
app.get('/styles', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.css'))
})
app.get('/js', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.js'))
})
app.use('/js', express.static(path.join(__dirname, 'server.js')))
app.use('/', express.static(path.join(__dirname, 'public/index.html')))
app.use(express.static(path.join(__dirname, 'public')))


app.get('/api/robots', (req, res) => {
    try {
        rollbar.log('bots sent')
        res.status(200).send(botsArr)
    } catch (error) {
        rollbar.error('bots did not load')
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
        rollbar.log("Error getting the five bots")

    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            rollbar.log('You lost the battle!')
            res.status(200).send('You lost!')
        } else {
            rollbar.log('You won the battle!')

            playerRecord.losses++
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        rollbar.error('Error in the Duel')
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})



const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})