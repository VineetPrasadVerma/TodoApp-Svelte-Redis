require('dotenv').config()

const express = require('express')
const redis = require('redis')

const app = express()

app.use(express.json())

app.get('/', (req, res) => { res.send('Runnong') })

app.listen(process.env.APP_PORT, () => console.log(`Todo server has started on PORT ${process.env.APP_PORT}`))
