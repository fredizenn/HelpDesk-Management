<script lang="ts">
	import { Icon } from "svelte-hero-icons";

    export let styling: any = ""
    export let title: any = ""
    export let titleStyle: any = ""
    export let labelIcon: any = ""
    export let labelColor: any = ""
</script>


<div class="p-6 text-gray-800 rounded-sm shadow hover:shadow-md
  {styling}">
  <div class="flex card-header justify-between">
    <div class="text-left font-semibold {titleStyle}">{title}</div>
    <div><Icon src={labelIcon} solid class="w-7 h-7 {labelColor}" /></div>
  </div>
 <div class="flex flex-col">
    <slot name="content"></slot>
 </div>
</div>