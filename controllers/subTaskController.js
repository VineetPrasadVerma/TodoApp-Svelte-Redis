const { redisCommands } = require('../models/todo')

const subTaskQueries = {}

subTaskQueries.getAllSubtask = async (req, res) => {
  try {
    const taskId = req.params.taskid

    const task = await redisCommands.exists(taskId)

    if (!task) {
      return res.status(404).json({ message: 'Task doesn\'t exist' })
    }

    const subTasks = JSON.parse(await redisCommands.hget(taskId, 'subTasks'))

    if (subTasks.length === 0) {
      return res.status(200).json({ subTaskCount: 0, message: 'No subTasks present' })
    }

    res.status(200).json(subTasks)
  } catch (e) {
    res.status(500).json({ message: 'Can\'t get tasks' })
  }
}

subTaskQueries.createSubtask = async (req, res) => {
  try {
    const taskId = req.params.taskid
    const subTaskName = req.body.subTaskName

    const task = await redisCommands.exists(taskId)

    if (!task) {
      return res.status(404).json({ message: 'Task doesn\'t exist' })
    }

    let id
    if (await redisCommands.exists('subTaskIdCounter')) {
      id = await redisCommands.incr('subTaskIdCounter')
    } else {
      await redisCommands.set('subTaskIdCounter', 0)
      id = 0
    }

    const subTasks = JSON.parse(await redisCommands.hget(taskId, 'subTasks'))

    const subTask = {
      id: id,
      name: subTaskName,
      scheduled: null,
      completed: false,
      priority: 0,
      note: ''
    }

    subTasks.push(subTask)

    await redisCommands.hset(taskId, 'subTasks', JSON.stringify(subTasks))

    res.status(201).send(subTasks)
  } catch (e) {
    res.status(500).json({ message: 'Can\'t add subTask' })
  }
}

module.exports = { subTaskQueries }
