<script>
  import {onMount, onDestroy} from 'svelte'
  import TaskStore from '../stores/taskStore.js'
  import TaskDetails from './TaskDetails.svelte' 

  let tasks = []  
  const baseURL = 'http://localhost:3000/tasks'

  const fetchAPI = async (reqObj) => {
    try {
      const res = await window.fetch(reqObj.url, reqObj.init)
      const data = await res.json()

      if (res.status === 200 || res.status === 201) {
        return data
      } else if (res.status === 500) {
        //  showError(res.status, data)
        return null
      } else if (res.status === 404) {
        //  showError(res.status, data)
        return null
      }
    } catch (error) {
        console.log(error)
    }
  }

  const readTasksDB = async () => {
    const reqObj = {
      url: baseURL + '/',
      init: {
        method: 'GET'
      }
    }

    let tasks = await fetchAPI(reqObj)
    if (tasks != null && tasks.rowCount !== 0) {
      return tasks
    } else {
      tasks = []
      return null
    }
  }

  onMount(async () => {        
    tasks = await readTasksDB()
    if(tasks) $TaskStore = tasks
    // console.log('created', tasks)
  })

  // onDestroy(() => console.log('destroyed',tasks))

</script>


<div id="lists-container">
  <h1 id='todo-heading'>TODOS</h1>

  <input id="add-list-input" placeholder=" Search | Add Lists" type="text">

  <div id="show-lists-container">
    {#each $TaskStore as task (task.taskId)}
      <TaskDetails {task} />
    {/each}
  </div>

</div>

<style>

</style>