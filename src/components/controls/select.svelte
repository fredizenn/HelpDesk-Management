<script lang="ts">
    export let label = "";
    export let options: any = [];
    export let value = "";
    export let required = false;
    export let error = "";
  
    const validate = () => {
      if (required && !value) {
        error = "This field is required";
      } else {
        error = "";
      }
    };
  
    const handleChange = (event: any) => {
      value = event.target.value;
      validate();
    };
  
    $: validate();
  
  </script>
   
  <div class="form-control">
    <label>{label}</label>
    <select class="select-bordered rounded select w-full max-w-xs" bind:value={value} on:change={handleChange}>
    {#if options.length > 0}
      {#each options as option}
        <option class="rounded-none dropdown-content menu  p-4" value={option.value}>{option.label}</option>
      {/each}
      {/if}
      <options>No options</options>
        </select>
    {#if error}
      <div class="error">{error}</div>
    {/if}
  </div>
  