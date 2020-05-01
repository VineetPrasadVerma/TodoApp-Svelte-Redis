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
    res.status(500).json({ taskCount: 0, message: 'Can\'t get tasks' })
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
    res.status(500).json({ message: 'Can\'t add Task' })
  }
}

taskQueries.updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskid
    const taskName = req.body.taskName

    const task = await redisCommands.hexists(taskId, 'taskName')

    if (!task) {
      return res.status(404).json({ message: `Can't find task with id ${taskId}` })
    }

    await redisCommands.hset(taskId, 'taskName', taskName)

    res.status(200).json({ message: `Task modified with ID: ${taskId}` })
  } catch (e) {
    res.status(500).json({ message: `Can't update task of ${req.params.id} id` })
  }
}

taskQueries.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskid

    const deletedTask = redisCommands.lrem('taskIds', 0, taskId)

    if (!deletedTask) {
      return res.status(404).json({ message: `Can't find task with id ${taskId}` })
    }

    await redisCommands.hdel(taskId, 'taskName')
    await redisCommands.hdel(taskId, 'subTasks')

    res.status(200).json({ message: `Task deleted with ID: ${taskId}` })
  } catch (e) {
    res.status(500).json({ message: `Can't delete task of ${req.params.id} id` })
  }
}

module.exports = { taskQueries }
