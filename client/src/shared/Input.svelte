<script>
  export let placeholder = ''
  export let inputValue = ''

  function focus(e){
    //use focus ->  focus action is functions called when element is created
    e.focus()
  }
</script>
  

<input use:focus id="input" type="text" placeholder={placeholder} on:keyup bind:value={inputValue}>
  
<style>
  #input{
      width: 100%;
  }
</style>