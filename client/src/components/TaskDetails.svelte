<script>
  import TaskStore from '../stores/taskStore.js'
  import Icon from 'fa-svelte'
  import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons/'

  export let task
  let isEditing = false
  let updatedTaskName = task.taskName

  const baseURL = 'http://localhost:3000/tasks'

  const fetchAPI = async (reqObj) => {
    try {
      const res = await window.fetch(reqObj.url, reqObj.init)
      const data = await res.json()

      if (res.status === 200 || res.status === 201) {
        return data
      } else if (res.status === 500) {
        //  showError(res.status, data)
        return null
      } else if (res.status === 404) {
        //  showError(res.status, data)
        return null
      }
    } catch (error) {
        console.log(error)
    }
  }

  const readTasksDB = async () => {
    const reqObj = {
      url: baseURL + '/',
      init: {
        method: 'GET'
      }
    }

    let tasks = await fetchAPI(reqObj)
    if (tasks != null && tasks.taskCount !== 0) {
      return tasks
    } else {
      tasks = []
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
      if(tasks) $TaskStore = tasks
      else {$TaskStore = []}
    }

    else{
        //Show Error Page
    }

  }

  async function updateTask(id) {
    if(event.keyCode === 13){

      if(updatedTaskName === ''){
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

      const result = await fetchAPI(reqObj)
      if(result){
        const tasks = await readTasksDB()
        if(tasks) $TaskStore = tasks
      }

      isEditing = false
    }
  }

  function showEditInputField() {
      isEditing = true
  }
</script>

<div id={task.taskId}>
    <span id='taskName'>
        {#if isEditing}
          <input type="text" bind:value={updatedTaskName} autofocus on:keyup={() => updateTask(task.taskId)}>
        {:else}
            {task.taskName}
            <span id='deleteIcon' on:click={() => deleteTask(task.taskId)}><Icon icon={faTrash}/></span>
            <span id='editIcon' on:click={() => showEditInputField()}><Icon icon={faPencilAlt}/></span>
        {/if}
    </span>
    
</div>

<style>
  /* #taskName{
      float: left;
  } */
</style>
