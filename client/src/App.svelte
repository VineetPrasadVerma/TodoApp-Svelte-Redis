<script>
	import Task from './components/Task.svelte'
	import SubTasks from './components/SubTasks.svelte'

	export let displaySubTasks = false
	let task

	function showSubTasks(e){
		displaySubTasks = true
		task = e.detail
	}

	function showTasks(e){
		displaySubTasks = false
	}

</script>

<main>
	{#if !displaySubTasks}
		<Task on:showSubTasks={showSubTasks}/>
	{:else}
		<SubTasks {task} on:showTasks={showTasks}/>
	{/if}
</main>

<style>
	main {
		text-align: center;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>