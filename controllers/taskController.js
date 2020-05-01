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
    const taskName = req.body.taskName

    let id
    if (await redisCommands.exists('taskIdCounter')) {
      id = await redisCommands.incr('taskIdCounter')
    } else {
      await redisCommands.set('taskIdCounter', 0)
      id = 0
    }

    await redisCommands.rpush('taskIds', id)

    await redisCommands.hset(id, 'taskName', taskName, 'subTasks', '[]')

    res.status(201).json({ taskId: id, taskName })
  } catch (e) {
    res.status(500).json({ message: 'Can\'t add list' })
  }
}

taskQueries.updateList = async (req, res) => {
  try {
    const listId = Number(req.params.id)
    const listName = req.body.listName
    const result = await pool.query('UPDATE LISTS SET list_name = $1 WHERE list_id = $2', [listName, listId])
    // console.log(result)
    if (result.rowCount === 0) return res.status(404).json({ message: `can't find list with id ${listId}` })
    res.status(200).json({ message: `List modified with ID: ${listId}` })
  } catch (e) {
    res.status(500).json({ message: `Can't update list of ${req.params.id} id` })
  }
}

module.exports = { taskQueries }
