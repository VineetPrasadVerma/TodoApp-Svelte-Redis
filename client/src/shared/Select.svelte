<script>
    export let priorityArray = []
    export let priorityValue = 0
</script>


<select id="priority" bind:value={priorityValue}> 
  {#each priorityArray as priority, i}
    <option value={i}>{priorityArray[i]}</option>
  {/each}
</select>

<style>
  #priority{
      grid-area: priority;
  }
</style>