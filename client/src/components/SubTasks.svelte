<script>
  import {onMount, onDestroy} from 'svelte'
  import SubTaskStore from '../stores/subTaskStore.js'
  import SubTaskDetails from './SubTasksDetails.svelte' 
  import {baseURL, fetchAPI} from '../shared/fetch.js'
  import { createEventDispatcher } from 'svelte';
  import Icon from 'fa-svelte'
  import { faArrowCircleLeft, faTimes } from '@fortawesome/free-solid-svg-icons/'

  export let task
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
    }
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

  function showTasks(){
    dispatch('showTasks')
  }


</script>


<div id='container'>

    <h2 id='taskName'><span id='backIcon' on:click={() => showTasks()}><Icon icon={faArrowCircleLeft}/></span>{task.taskName}<span id='timesIcon'><Icon icon={faTimes}/></span></h2>

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

  #backIcon{
    float: left;
    padding: 4px 0;
    font-size: 20px;
  }

  #timesIcon{
    float: right;
    padding: 4px 0;
    font-size: 20px;
  }
</style>
