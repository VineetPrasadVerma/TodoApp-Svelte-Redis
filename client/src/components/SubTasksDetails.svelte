<script>
  import SubTaskStore from '../stores/subTaskStore.js'
  import Icon from 'fa-svelte'
  import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons/'
  import {baseURL, fetchAPI} from '../shared/fetch.js'
  import { createEventDispatcher } from 'svelte';


  export let subTask
  let isEditing = false

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

  function focus(e){
    //use focus ->  focus action is functions called when element is created
    e.focus()
  }


</script>

<!-- bind:value={updatedTaskName} on:keyup={() => updateTask(task.taskId) -->

<div id={subTask.id}>
    {#if isEditing}
      <input type="text" use:focus>
    {:else}
      <span id='subTaskName'>{subTask.name} </span>
      <span id='deleteIcon' on:click={() => deleteTask(subTask.taskId)}><Icon icon={faTrash}/></span>
      <span id='editIcon' on:click={() => showEditInputField()}><Icon icon={faPencilAlt}/></span>
    {/if}  
</div>

<style>
  div{
    padding: 5px;
  }

  input{
    width: 100%;
  }

  #subTaskName{
    float: left;
  }

  #deleteIcon{
    float: right;
    margin-left: 5px;
  }

  #editIcon{
    /* float: right; */
    margin-left: 150px;
    /* position: absolute; */
  }
</style>