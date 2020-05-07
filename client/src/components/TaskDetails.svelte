<script>
    import Icon from 'fa-svelte'
    import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons/'
    // import { faPencilSquare } from '@fortawesome/free-solid-svg-icons/faPencilSquare'

    export let task

    function handleClick(id) {
        console.log(id, 'Trash Clicked') 
    }

</script>

<div id={task.taskId}>
    <span id='list-item'>{task.taskName}</span>
    <span on:click={() => handleClick(task.taskId)}><Icon icon={faTrash}  ></Icon></span>
    <Icon icon={faPencilAlt}></Icon>
</div>

<style>
    /* #list-item{
        color:red;
    } */

    /* Icon{
        color: red;
    } */
</style>
