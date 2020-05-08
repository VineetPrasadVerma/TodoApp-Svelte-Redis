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


</script>

<!-- on:keyup={() => addTask(event)} bind:value={taskName} -->

<div id='container'>

    <h1 id='taskName'>{task.taskName}</h1>

    <input id="addSubTaskInput" use:focus placeholder=" Add SubTasks"  type="text">
    
    {#each $SubTaskStore as subTask (subTask.taskId)}
      <SubTaskDetails {subTask}/>
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
