require('dotenv').config()

const express = require('express')

const taskRoutes = require('./routes/taskRoutes')
// const subTaskRoutes = require('./routes/subTaskRoutes')

const app = express()

app.use(express.json())

app.use('/tasks', taskRoutes)
// app.use('/tasks/:id/subtasks', subTaskRoutes)

app.listen(process.env.APP_PORT, () => console.log(`Todo server has started on PORT ${process.env.APP_PORT}`))
