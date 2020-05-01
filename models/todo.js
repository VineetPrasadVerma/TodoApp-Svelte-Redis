const redis = require('redis')
const client = redis.createClient()
const { promisify } = require('util')

client.on('error', (error) => {
  console.error(error)
})

client.on('connect', () => {
  console.error('Connected to Reddis on port 6379')
})

const redisCommands = {}

redisCommands.get = promisify(client.get).bind(client)
redisCommands.set = promisify(client.set).bind(client)
redisCommands.incr = promisify(client.incr).bind(client)
redisCommands.exists = promisify(client.exists).bind(client)
redisCommands.rpush = promisify(client.rpush).bind(client)
redisCommands.lrange = promisify(client.lrange).bind(client)
redisCommands.lrem = promisify(client.lrem).bind(client)
redisCommands.hset = promisify(client.hset).bind(client)
redisCommands.hgetall = promisify(client.hgetall).bind(client)
redisCommands.hget = promisify(client.hget).bind(client)
redisCommands.hexists = promisify(client.hexists).bind(client)
redisCommands.hdel = promisify(client.hdel).bind(client)

module.exports = { redisCommands }
