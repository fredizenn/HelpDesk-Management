<script lang="ts">
    export let styling: any = ""
    export let title: any = ""
</script>


<div class="p-6 bg-white text-gray-800 text-center rounded-sm shadow hover:shadow-md
  {styling}">
  <div class="text-left font-semibold text-gray-500">{title}</div>
 <div class="flex flex-col items-center">
    <slot name="content"></slot>
 </div>
</div>