<script>
  import {onMount, onDestroy} from 'svelte'
  import SubTaskStore from '../stores/subTaskStore.js'
  import SubTaskDetails from './SubTasksDetails.svelte' 
  import {baseURL, fetchAPI} from '../shared/fetch.js'
  import { createEventDispatcher } from 'svelte'
  import Icon from 'fa-svelte'
  import { faArrowCircleLeft, faTimes } from '@fortawesome/free-solid-svg-icons/'
  import Error from '../shared/Error.svelte'

  let showErrorPage = false
  let message = ''

  export let task

  let isDisable = true

  const dispatch = createEventDispatcher()

  async function readSubTasksDB() {
    const reqObj = {
      url: baseURL + '/' + task.taskId + '/subtasks/',
      init: {
        method: 'GET'
      }
    }

    let subTasks = await fetchAPI(reqObj)

    if (subTasks != null && subTasks.subTaskCount !== 0) {

      if(subTasks.message) {
        subTasks = []
        return subTasks
      }

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
      
      return subTasks
    } else {
      subTasks = []
      return null
    }
  }

  onMount(async () => {        
    const subTasks = await readSubTasksDB()

    if(subTasks) {
      $SubTaskStore = subTasks
      let completedTasks = subTasks.filter(subTask => subTask.completed)
      if(completedTasks.length > 0){
        isDisable = false
      } 
    }
    else{
      message = 'Can\'t get subtasks'
      showErrorPage = true
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
          message = 'Can\'t get subtasks'
          showErrorPage = true
        }

      } else {
        message = 'Can\'t add subtask'
        showErrorPage = true
      }

      subTaskName = ''
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
        message = 'Can\'t get subtasks'
        showErrorPage = true
      }

    } else {
      message = 'Can\'t delete subtask'
      showErrorPage = true
    }

  }

  async function clearCompletedSubTasks(){
    const subTasks = await readSubTasksDB()
    if(subTasks){
      const completedSubTasks = subTasks.filter(subTask => subTask.completed)

      for(let subTask of completedSubTasks){
        await deleteSubTask(subTask.id)
      }

      const subtasks = await readSubTasksDB()
      if(subtasks) $SubTaskStore = subtasks
      else{
        message = 'Can\'t get subtasks'
        showErrorPage = true
      }

    }else{
      message = 'Can\'t get subtask'
      showErrorPage = true
    }
  }

  function showTasks(){
    dispatch('showTasks')
  }

  function enableClearSubTaskButton(e){
    isDisable = e.detail
  } 

  function handleError(e){
    message = e.detail
    showErrorPage = true
  }
  
</script>


{#if !showErrorPage}
  <div id='container'>

    <h2 id='taskName'><span id='backIcon' on:click={() => showTasks()}><Icon icon={faArrowCircleLeft}/></span>{task.taskName}<span class='timesIcon' class:disable={isDisable} on:click={()=> clearCompletedSubTasks()} title="Clear Completed Task"><Icon icon={faTimes}/></span></h2>

    <input id="addSubTaskInput" use:focus placeholder=" Add SubTasks"  type="text" on:keyup={() => addSubTask()} bind:value={subTaskName}>
    
    {#each $SubTaskStore as subTask (subTask.id)}
      <SubTaskDetails {subTask} {task} on:enableClearSubTaskButton={enableClearSubTaskButton} on:handleError={handleError}/>
    {/each}

  </div>
{:else}
  <Error {message} />
{/if}


<style>
  #container{
    width: 360px;
    margin: 100px auto;
  }
  
  #addSubTaskInput{
      width: 100%;
  }

  #backIcon{
    float: left;
    padding: 4px 0;
    font-size: 20px;
  }

  .timesIcon{
    float: right;
    padding: 4px 0;
    font-size: 20px;
  }

  .disable{
    color: gray;
    pointer-Events:none;
  }

</style>
