<script>
  import { createEventDispatcher } from 'svelte'

  let dispatch = createEventDispatcher()

  export let priorityArray = []
  export let priority = 0

  function updatePriority(){
    dispatch('updatePriority', priority)
  }
</script>


<select id="priority" bind:value={priority} on:change={updatePriority}> 
  {#each priorityArray as priority, i}
    <option value={i}>{priorityArray[i]}</option>
  {/each}
</select>

<style>
  #priority{
      grid-area: priority;
  }
</style>