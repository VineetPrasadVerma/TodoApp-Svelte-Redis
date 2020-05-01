const { redisCommands } = require('../models/todo')

const taskQueries = {}

taskQueries.getAllTasks = async (req, res) => {
  try {
    const taskIds = await redisCommands.lrange('taskIds', 0, -1)

    if (taskIds.length === 0) return res.status(200).json({ taskCount: 0, message: 'No tasks present' })

    const tasks = []

    for (const id of taskIds) {
      const taskName = await redisCommands.hget(id, 'taskName')
      tasks.push({ taskId: id, taskName })
    }

    res.status(200).json(tasks)
  } catch (e) {
    res.status(500).json({ taskCount: 0, message: 'Can\'t get lists' })
  }
}

taskQueries.createTask = async (req, res) => {
  try {
    console.log(1)
    const taskName = req.body.taskName
    console.log(taskName)
    console.log(taskName, await redisCommands.exists('taskIdCounter'), await redisCommands.exists('taskIdCounte'), await redisCommands.incr('taskIdCounter'))
    if (await redisCommands.exists('taskIdCounter')) {
      await redisCommands.incr('taskIdCounter')
    } else { await redisCommands.incr('taskIdCounter') }

    // const result = await pool.query('INSERT INTO LISTS (list_name) VALUES ($1) RETURNING *', [listName])
    // console.log(result)
    // res.status(201).json(result.rows)
  } catch (e) {
    res.status(500).json({ message: 'Can\'t add list' })
  }
}

module.exports = { taskQueries }
