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
    if (tasks != null && tasks.taskCount !== 0) {
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

  function searchTasks(event) {
    event.target.placeholder = ' Search | Add Lists'
    const searchedTasks = tasks.filter(task => task.taskName.toLowerCase().includes(event.target.value.toLowerCase()))
    $TaskStore = searchedTasks
  }

  let taskName = ''

  async function addTask(event) {
    searchTasks(event)

    if(event.keyCode === 13){

      if(taskName === ''){
        event.target.placeholder = 'Can\'t add empty Task'
        return
      }

      const reqObj = {
        url: baseURL + '/',
        init: {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ taskName: taskName })
        }
      }

      let createdTask = await fetchAPI(reqObj)

      if(createdTask){
        const tasks = await readTasksDB()
        if(tasks) $TaskStore = tasks
        else {$TaskStore = []}
      }

      taskName = ''
    }
  }
</script>


<div id="lists-container">
  <h1 id='todo-heading'>TODOS</h1>

  <input id="add-list-input" placeholder=" Search | Add Lists" type="text" on:keyup={() => addTask(event)} bind:value={taskName}>

  <div id="show-lists-container">
    {#each $TaskStore as task (task.taskId)}
      <TaskDetails {task}/>
    {/each}
  </div>

</div>

<style>

</style>