<script lang='ts'>
    import { createField } from "felte";
  
    export let name: any;
    export let label: any;
  
    const { field, onInput, onBlur } = createField(name);
  
    function handleInput(e: any) {
      onInput(e.currentTarget.innerText.replace("\n", ""));
    }
  
    function handleEnter(e: any) {
      if (e.key !== "Enter") return;
      e.preventDefault();
      e.currentTarget.closest("form").requestSubmit();
    }
  </script>
  
  <div
   id={name}
   data-felte-reporter-tippy-trigger-for={name}
   >
   {label}
   </div>
  <div
    class="input input-bordered"
    use:field
    on:input={handleInput}
    on:blur={onBlur}
    on:keydown={handleEnter}
    aria-labelledby={name}
    role="textbox"
    contenteditable="true"
    tabindex="0"
    data-felte-reporter-tippy-position-for={name}
    data-felte-reporter-tippy-trigger-for={name}
    />