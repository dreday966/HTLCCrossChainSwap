
const express = require('express')
const app = express()
const port = 3000
var cors = require('cors')
var bodyParser = require('body-parser')


app.use(express.json())
app.use(cors())

var players = []
// var player2 = []

setInterval(() => {
    console.log(players)
}, 10 * 1000)

app.post('/updateState', (req, res) => {
    const {id, info} = req.body
    const found = players.find(x=> x.id === id);
    if (found) {
        players = players.map(x => {
            return x.id === id ? {id, info: {...x.info, ...info}} : x
        })
    } else {
        players.push({id, info})
    }
    res.send('ok')
})

app.post('/getState', (req, res) => {
    const {id} = req.body
    const found = players.find(x=> x.id !== id);
    // console.log(players)
    res.json(found ? found.info : {})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})