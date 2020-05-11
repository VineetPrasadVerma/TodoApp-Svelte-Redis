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
  let isCompleted = subTask.completed
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

  async function updateSubTaskName(id) {
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

  async function updateSubTask(id, key, value) {

    const reqObj = {
      url: baseURL + '/' + task.taskId + '/subtasks/' + id,
      init: {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      }
    }

    const response = await fetchAPI(reqObj)
    if(response){
      if(key === 'completed') isCompleted != isCompleted

      // Update Order

      let subTasks = await readSubTasksDB()

      if(subTasks) {
        $SubTaskStore = subTasks
        updateOrderOfSubTasks()
      }
      else {
        $SubTaskStore = []
        //showError
      }

    }else{
      //showError
    }
  }

  function updateOrderOfSubTasks(){
    isExpand = false
    const subTasks = $SubTaskStore

    subTasks.sort((a, b) => a.id - b.id)

    subTasks.sort((a, b) => {
      if (a.scheduled > b.scheduled) return 1
      if (b.scheduled > a.scheduled) return -1
      return 0
    })

    subTasks.sort((a, b) => b.priority - a.priority)

    subTasks.sort((a, b) => {
      if (String(a.completed) > String(b.completed)) return 1
      if (String(b.completed) > String(a.completed)) return -1
      return 0
    })

    $SubTaskStore = subTasks
  }


  function showEditInputField() {
      isEditing = true
  }

  function expandSubTask(id){
    isExpand = !isExpand
  }

  async function updateFromExpandSubTask(event){
    let key = Object.keys(event.detail)[0]
    let value = event.detail[key]

    // console.log(value)

    await updateSubTask(subTask.id, key, value)
  }

  function focus(e){
    //use focus ->  focus action is functions called when element is created
    e.focus()
  }


</script>


<div id={subTask.id}>
    {#if isEditing}
      <input id="editInputField" type="text" use:focus bind:value={updatedSubTaskName} on:keyup={() => updateSubTaskName(subTask.id)}>
    {:else}
      <input id="completedCheckbox" type="checkbox" bind:checked={isCompleted} on:click={() => updateSubTask(subTask.id, 'completed', !isCompleted)}>
      <span id='subTaskName'>{subTask.name} </span>
      <span id='arrowCircleDownIcon' on:click={() => expandSubTask(subTask.id)}><Icon icon={faArrowCircleDown}/></span>
      <span id='deleteIcon' on:click={() => deleteSubTask(subTask.id)}><Icon icon={faTrash}/></span>
      <span id='editIcon' on:click={() => showEditInputField(subTask.id)}><Icon icon={faPencilAlt}/></span>
      <div></div>

      {#if isExpand}
        <SubTaskExpand {subTask} on:updateFromExpandSubTask={updateFromExpandSubTask}/>
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
    margin-top: 3px;
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