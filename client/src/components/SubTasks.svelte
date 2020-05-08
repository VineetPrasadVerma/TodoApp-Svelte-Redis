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


</script>

<div id='container'>

    <h1 id='taskName'>{task.taskName}</h1>

    <!-- <input id="addTaskInput" use:focus placeholder=" Search | Add Lists"  type="text" on:keyup={() => addTask(event)} bind:value={taskName}>
    
    {#each $TaskStore as task (task.taskId)}
      <TaskDetails {task} on:updateAllTasks={updateAllTasks} on:showSubTasks/>
    {/each} -->

</div>


<style></style>