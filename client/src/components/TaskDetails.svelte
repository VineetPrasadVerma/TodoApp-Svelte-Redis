<script>
  import TaskStore from '../stores/taskStore.js'
  import Icon from 'fa-svelte'
  import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons/'
  import {baseURL, fetchAPI} from '../shared/fetch.js'
  import { createEventDispatcher } from 'svelte'
  import CustomInput from '../shared/Input.svelte'

  export let task

  const dispatch = createEventDispatcher();

  let isEditing = false
  let updatedTaskName = task.taskName

  async function readTasksDB(){
    const reqObj = {
      url: baseURL + '/',
      init: {
        method: 'GET'
      }
    }

    let tasks = await fetchAPI(reqObj)
    if (tasks != null && tasks.taskCount !== 0) {
      dispatch('updateAllTasks', tasks)
      return tasks
    } else {
      if(tasks){
        tasks = []
        return tasks
      }
      // dispatch('updateAllTasks', tasks)
      dispatch('handleError', 'Can\'t get tasks')
      return null
    }
  }

  async function deleteTask(id) {
    const reqObj = {
      url: baseURL + `/${id}`,
      init: {
        method: 'DELETE'
      }
    }

    const result = await fetchAPI(reqObj)
    if(result){
      const tasks = await readTasksDB()
      if(tasks) {$TaskStore = tasks
      console.log($TaskStore)
      }
      else {
        $TaskStore = []

        dispatch('handleError', 'Can\'t get tasks')
      }

    } else {
      dispatch('handleError', 'Can\'t delete tasks')
    }

  }

  async function updateTask(id) {
    if(event.keyCode === 13){

      if(event.target.value === ''){
        event.target.placeholder = 'Can\'t add empty Task'
        return
      }

      const reqObj = {
        url: baseURL + `/${id}`,
        init: {
          method: 'PUT',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({ taskName: updatedTaskName })
        }
      }

      // updatedTaskName = event.target.value
      
      const result = await fetchAPI(reqObj)
      if(result){
        const tasks = await readTasksDB()

        if(tasks) $TaskStore = tasks
        else {
          $TaskStore = []
          dispatch('handleError', 'Can\'t get tasks')
        }

      }else{
        dispatch('handleError', 'Can\'t update tasks')
      }

      isEditing = false
    }
  }

  function showEditInputField() {
      isEditing = true
  }


  function focus(e){
    //use focus ->  focus action is function, called when element is created
    e.focus()
  }

  function showSubTasks(task){
    dispatch('showSubTasks', task)
  }

</script>

<div id={task.taskId}>
  {#if isEditing}
    <input type="text" use:focus bind:value={updatedTaskName} on:keyup={() => updateTask(task.taskId)}>
    <!-- <CustomInput on:keyup={() => updateTask(task.taskId)} inputValue={updatedTaskName}/> -->
  {:else}
    <span id='taskName' on:click={() => showSubTasks(task)}>{task.taskName} </span>
    <span id='deleteIcon' on:click={() => deleteTask(task.taskId)}><Icon icon={faTrash}/></span>
    <span id='editIcon' on:click={() => showEditInputField(task.id)}><Icon icon={faPencilAlt}/></span>
    <div></div>
  {/if}  
</div>

<style>
  div{
    padding: 8px;
  }

  input{
    width: 100%;
  }

  #taskName{
    float: left;
  }

  #taskName:hover{
    cursor: pointer;
  }

  #deleteIcon{
    float: right;
    /* margin-left: 5px; */
  }

  #editIcon{
    float: right;
    margin-right: 8px;
  }

</style>
