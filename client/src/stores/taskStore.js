import { writable } from 'svelte/store'
// import { onMount } from 'svelte'

// const baseURL = 'http://localhost:3000/tasks'
// let allTasks = []

// // onMount(async () => {
// //   tasks = await readTasksDB()
// //   console.log(tasks)
// // })

// const fetchFromDB = async (reqObj) => {
//   try {
//     const res = await window.fetch(reqObj.url, reqObj.init)
//     const data = await res.json()

//     if (res.status === 200 || res.status === 201) {
//       return data
//     } else if (res.status === 500) {
//     //  showError(res.status, data)
//       return null
//     } else if (res.status === 404) {
//     //  showError(res.status, data)
//       return null
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

// const readTasksDB = async () => {
//   const reqObj = {
//     url: baseURL + '/',
//     init: {
//       method: 'GET'
//     }
//   }

//   let tasks = await fetchFromDB(reqObj)
//   if (tasks != null && tasks.rowCount !== 0) {
//     allTasks = tasks
//     return tasks
//   } else {
//     tasks = []
//     return null
//   }
// }

// const promise = new Promise((resolve) => {
//   resolve(readTasksDB())
// })

// promise.then(res => console.log(allTasks))

const TaskStore = writable([])

export default TaskStore
