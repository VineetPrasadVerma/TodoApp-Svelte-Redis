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
      return res.status(200).json({ message: 'No subTasks present' })
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
      scheduled: 'null',
      completed: false,
      priority: 0,
      note: ''
    }

    subTasks.push(subTask)

    await redisCommands.hset(taskId, 'subTasks', JSON.stringify(subTasks))

    res.status(201).send(subTask)
  } catch (e) {
    res.status(500).json({ message: 'Can\'t add subTask' })
  }
}

subTaskQueries.updateSubtask = async (req, res) => {
  try {
    const taskId = req.params.taskid
    const subTaskId = req.params.subtaskid

    const requestBody = req.body
    const subTaskField = Object.keys(requestBody)[0]
    const subTaskValue = requestBody[subTaskField]
    const task = await redisCommands.exists(taskId)

    if (!task) {
      return res.status(404).json({ message: 'Task doesn\'t exist' })
    }

    const subTasks = JSON.parse(await redisCommands.hget(taskId, 'subTasks'))

    const index = subTasks.findIndex(task => task.id == subTaskId)

    if (index !== -1) {
      Object.assign(subTasks[index], { [subTaskField]: subTaskValue })
      await redisCommands.hset(taskId, 'subTasks', JSON.stringify(subTasks))
      return res.status(200).send({ message: `Subtask modified with ID: ${subTaskId}` })
    }

    return res.status(404).json({ message: `Can't find subtask with id ${subTaskId}` })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: `Can't update subtask of ${req.params.subtaskid} id` })
  }
}

subTaskQueries.deleteSubtask = async (req, res) => {
  try {
    const taskId = req.params.taskid
    const subTaskId = req.params.subtaskid

    const task = await redisCommands.exists(taskId)

    if (!task) {
      return res.status(404).json({ message: 'Subtask doesn\'t exist' })
    }

    const subTasks = JSON.parse(await redisCommands.hget(taskId, 'subTasks'))

    const index = subTasks.findIndex(task => task.id == subTaskId)
    if (index !== -1) {
      subTasks.splice(index, 1)
      await redisCommands.hset(taskId, 'subTasks', JSON.stringify(subTasks))
      return res.status(200).send({ message: `Subtask deleted with ID: ${subTaskId}` })
    }

    return res.status(404).json({ message: `Can't find subtask with id ${subTaskId}` })
  } catch (e) {
    res.status(500).json({ message: `Can't delete subtask of id ${req.params.taskId}` })
  }
}

subTaskQueries.deleteCompletedSubtasks = async (req, res) => {
  try {
    const taskId = req.params.taskid

    const task = await redisCommands.exists(taskId)

    if (!task) {
      return res.status(404).json({ message: 'Subtask doesn\'t exist' })
    }

    let subTasks = JSON.parse(await redisCommands.hget(taskId, 'subTasks'))
    const totalSubtasks = subTasks.length
    const filteredSubtasks = subTasks.filter(task => task.completed === false)
    subTasks = filteredSubtasks

    if (subTasks.length === totalSubtasks) return res.status(404).json({ message: 'Don\'t have any completed subtask' })

    await redisCommands.hset(taskId, 'subTasks', JSON.stringify(subTasks))
    return res.status(200).send({ message: 'Subtasks deleted' })
  } catch (e) {
    res.status(500).json({ message: 'Can\'t delete subtasks ' })
  }
}

module.exports = { subTaskQueries }
