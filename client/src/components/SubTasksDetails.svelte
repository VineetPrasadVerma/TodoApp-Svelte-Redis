<script>
  import SubTaskStore from '../stores/subTaskStore.js'
  import Icon from 'fa-svelte'
  import SubTaskExpand from './SubTaskExpand.svelte'
  import { faTrash, faPencilAlt, faArrowCircleDown, faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons/'
  import {baseURL, fetchAPI} from '../shared/fetch.js'
  import { createEventDispatcher } from 'svelte'

  export let subTask
  export let task
  
  let isEditing = false
  let isExpand = false
  let updatedSubTaskName = subTask.name 

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

  async function updateSubTask(id) {
    event.target.placeholder = 'Add Subtask'
    
    if(event.keyCode === 13){

      if(updatedSubTaskName === ''){
        event.target.placeholder = 'Can\'t add empty Task'
        return
      }

      const reqObj = {
        url: baseURL + '/' + task.taskId + '/subtasks/' + id,
        init: {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ name: updatedSubTaskName })
        }
      }

      const response = await fetchAPI(reqObj)
      if(response){
        const subTasks = await readSubTasksDB()

        if(subTasks) $SubTaskStore = subTasks
        else {
          $SubTaskStore = []
          //showError
        }

      }else{
        //showError
      }

      isEditing = false
    }
  }

  async function deleteSubTask(id) {
    const reqObj = {
      url: baseURL + '/' + task.taskId + '/subtasks/' + id,
      init: {
        method: 'DELETE'
      }
    }

    const response = await fetchAPI(reqObj)

    if(response){
      const subTasks = await readSubTasksDB()

      if(subTasks) $SubTaskStore = subTasks
      else {
        $SubTaskStore = []
        //showError
      }

    } else {
        //Show Error Page
    }

  }

  function showEditInputField() {
      isEditing = true
  }

  function expandSubTask(id){
    isExpand = !isExpand
  }

  function focus(e){
    //use focus ->  focus action is functions called when element is created
    e.focus()
  }


</script>


<div id={subTask.id}>
    {#if isEditing}
      <input id="editInputField" type="text" use:focus bind:value={updatedSubTaskName} on:keyup={() => updateSubTask(subTask.id)}>
    {:else}
      <input id="completedCheckbox" type="checkbox">
      <span id='subTaskName'>{subTask.name} </span>
      <span id='arrowCircleDownIcon' on:click={() => expandSubTask(subTask.id)}><Icon icon={faArrowCircleDown}/></span>
      <span id='deleteIcon' on:click={() => deleteSubTask(subTask.id)}><Icon icon={faTrash}/></span>
      <span id='editIcon' on:click={() => showEditInputField(subTask.id)}><Icon icon={faPencilAlt}/></span>
      <div></div>

      {#if isExpand}
        <SubTaskExpand />
      {/if}

    {/if} 
    
    
</div>


<style>
  div{
    padding: 8px;
  }

  #editInputField{
    width: 100%;
  }

  #completedCheckbox{
    float: left;
    margin-right: 5px;
    margin-top: 2px;
  }

  #subTaskName{
    float: left;
  }

  #arrowCircleDownIcon{
    float:right;
  }

  #deleteIcon{
    float: right;
    margin-right: 8px;
  }

  #editIcon{
    float: right;
    margin-right: 8px;
    /* margin-left: 150px; */
    /* position: absolute; */
  }
</style>