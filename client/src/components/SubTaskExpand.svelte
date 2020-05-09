<script>
  import CustomSelect from '../shared/Select.svelte'
  let priorityValue = 0
  let priorityArray = ['None', 'Low', 'Medium', 'High']
</script>

<div id="subTaskExpand">
    <span id="notesLabel">Notes:</span>
    <textarea id="notes"></textarea>
    <CustomSelect {priorityArray} {priorityValue} />
    <input id="scheduling" type="date">
</div>

<style>
    
#notesLabel{
    grid-area: notesLabel;
    text-align: left;
}

#notes{
    grid-area: notes; 
    resize: none;
}

#scheduling{
    grid-area: scheduling;
    margin-top: 10px;
}

#priority{
    grid-area: priority;
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