<script>
  import {onMount, onDestroy} from 'svelte'
  import TaskStore from '../stores/taskStore.js'
  import TaskDetails from './TaskDetails.svelte' 
  import {baseURL, fetchAPI} from '../shared/fetch.js'
  import Error from '../shared/Error.svelte'

  let allTasks = []  

  let showErrorPage = false
  let message = ''

  async function readTasksDB() {
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
      allTasks = tasks
      return null
    }
  }

  onMount(async () => {        
    const tasks = await readTasksDB()
    if(tasks) $TaskStore = tasks
    else{
      message = 'Can\'t get tasks'
      showErrorPage = true
    }
    // console.log('created', tasks)
  })

  // onDestroy(() => console.log('destroyed',tasks))

  function searchTasks(event) {
    event.target.placeholder = ' Search | Add Tasks'
    const searchedTasks = allTasks.filter(task => task.taskName.toLowerCase().includes(event.target.value.toLowerCase()))
    $TaskStore = searchedTasks
  }

  let taskName = ''

  async function addTask() {
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
        else {
          $TaskStore = []
          
          message = 'Can\'t get tasks'
          showErrorPage = true
        }

      } else {
        message = 'Can\'t add Task'
        showErrorPage = true
      }

      taskName = ''
    }
  }

  function updateAllTasks(e) {
    allTasks = e.detail
  }

  function focus(e){
    //use focus ->  focus action is functions called when element is created
    e.focus()
  }

  function handleError(e){
    message = e.detail
    showErrorPage = true
  }

</script>

  {#if !showErrorPage}
    <div id='container'>

      <h1 id='todoHeading'>TODOS</h1>

      <input id="addTaskInput" use:focus placeholder=" Search | Add Tasks"  type="text" on:keyup={() => addTask()} bind:value={taskName}>
      
        {#each $TaskStore as task (task.taskId)}
          <TaskDetails {task} on:updateAllTasks={updateAllTasks} on:showSubTasks on:handleError={handleError}/>
        {/each}
  </div>
  {:else}
    <Error {message}/>
  {/if}


<style>

  #container{
    width: 360px;
    margin: 100px auto;
  }
  
  #addTaskInput{
      width: 100%;
  }
</style>