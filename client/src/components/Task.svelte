<script>
  import {onMount, onDestroy} from 'svelte'
  import TaskStore from '../stores/taskStore.js'
  import TaskDetails from './TaskDetails.svelte' 
  import {baseURL, fetchAPI} from '../shared/fetch.js'

  let allTasks = []  

  const readTasksDB = async () => {
    const reqObj = {
      url: baseURL + '/',
      init: {
        method: 'GET'
      }
    }

    let tasks = await fetchAPI(reqObj)
    if (tasks != null && tasks.taskCount !== 0) {
      allTasks = tasks
      return tasks
    } else {
      tasks = []
      allTasks = []
      return null
    }
  }

  onMount(async () => {        
    const tasks = await readTasksDB()
    if(tasks) $TaskStore = tasks
    // console.log('created', tasks)
  })

  // onDestroy(() => console.log('destroyed',tasks))

  function searchTasks(event) {
    event.target.placeholder = ' Search | Add Lists'
    const searchedTasks = allTasks.filter(task => task.taskName.toLowerCase().includes(event.target.value.toLowerCase()))
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

  function updateAllTasks(e) {
    allTasks = e.detail
  }

</script>


<div id="lists-container">
  <h1 id='todo-heading'>TODOS</h1>

  <input id="add-list-input" placeholder=" Search | Add Lists" type="text" on:keyup={() => addTask(event)} bind:value={taskName}>

  <div id="show-lists-container">
    {#each $TaskStore as task (task.taskId)}
      <TaskDetails {task} on:updateAllTasks={updateAllTasks}/>
    {/each}
  </div>

</div>

<style>

</style>