<script>
  import CustomSelect from '../shared/Select.svelte'
  import { createEventDispatcher } from 'svelte'

  let dispatch = createEventDispatcher()

  export let subTask = {}

  let priorityArray = ['None', 'Low', 'Medium', 'High']
  let priority = subTask.priority
  let notes = subTask.note
  let scheduled = subTask.scheduled
  
  let key, value = ''

  function updatePriority(event){
    priority = event.detail
    updateSubTask('priority')
  }

  function updateSubTask(id){
    key = id
    value = ''
    if(key === 'note'){
      value = notes
    }else if(key === 'scheduled'){
      if(scheduled === '') {
        value = 'null'  
      }else{
        value = scheduled
      }
    }else if(key === 'priority'){
      value = priority
    }
    dispatch('updateFromExpandSubTask', {
      [key]:value
    })
  }

</script>

<div id="subTaskExpand">
  <span id="notesLabel">Notes:</span>
  <textarea id="note" bind:value={notes} on:change={() => updateSubTask('note')}></textarea>
  <CustomSelect {priorityArray} {priority} on:updatePriority={updatePriority}/>
  <input id="scheduled" type="date" bind:value={scheduled} on:change={() => updateSubTask('scheduled')}>
</div>

<style>
    
    #notesLabel{
        grid-area: notesLabel;
        text-align: left;
    }

    #note{
        grid-area: notes; 
        resize: none;
    }

    #scheduled{
        grid-area: scheduling;
        margin-top: 10px;
    }

    #subTaskExpand{
        display: grid;
        height: 150px;
        margin-top: 10px;
        border: 1px solid gray;
        grid-column-gap: 5px;
        padding: 5px;
        grid-template-areas: 
        "notesLabel notesLabel . ."
        "notes notes . ."
        "notes notes priority priority"
        "notes notes scheduling scheduling"
        "notes notes . ."
        "notes notes . ."
    
    }

</style>