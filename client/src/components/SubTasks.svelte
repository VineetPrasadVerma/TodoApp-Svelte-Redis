<script>
  import {onMount, onDestroy} from 'svelte'
  import SubTaskStore from '../stores/subTaskStore.js'
  import SubTaskDetails from './SubTasksDetails.svelte' 
  import {baseURL, fetchAPI} from '../shared/fetch.js'

  export let task

  async function readSubTasksDB() {
    const reqObj = {
      url: baseURL + '/' + task.taskId + '/subtasks/',
      init: {
        method: 'GET'
      }
    }

    let subTasks = await fetchAPI(reqObj)
    if (subTasks != null && subTasks.subTaskCount !== 0) {
      if(subTasks.message) subTasks = []
      return subTasks
    } else {
      subTasks = []
      return null
    }
  }

  onMount(async () => {        
    const subTasks = await readSubTasksDB()
    if(subTasks) $SubTaskStore = subTasks
    else{
      //showError()
    }
  })

  function focus(e){
    //use focus ->  focus action is functions called when element is created
    e.focus()
  }

  let subTaskName = ''

  async function addSubTask() {
    event.target.placeholder = 'Add Subtask'
    
    if(event.keyCode === 13){

      if(subTaskName === ''){
        event.target.placeholder = 'Can\'t add empty SubTask'
        return
      }

      const reqObj = {
        url: baseURL + '/' + task.taskId + '/subtasks/',
        init: {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ subTaskName: subTaskName })
        }
      }

      let createdSubTask = await fetchAPI(reqObj)

      if(createdSubTask){
        const subTasks = await readSubTasksDB()

        if(subTasks) $SubTaskStore = subTasks
        else {
          $SubTaskStore = []
          // showError()
        }

      } else {
        //showError()
      }

      subTaskName = ''
    }
  }


</script>


<div id='container'>

    <h1 id='taskName'>{task.taskName}</h1>

    <input id="addSubTaskInput" use:focus placeholder=" Add SubTasks"  type="text" on:keyup={() => addSubTask()} bind:value={subTaskName}>
    
    {#each $SubTaskStore as subTask (subTask.id)}
      <SubTaskDetails {subTask} {task}/>
    {/each}

</div>


<style>
  #container{
    width: 360px;
    margin: 100px auto;
  }
  
  #addSubTaskInput{
      width: 100%;
  }
</style>
