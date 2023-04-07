<script lang="ts">
	import { Icon, Plus } from "svelte-hero-icons";

    export let click: any
    export let label: any

</script>

<button class="btn btn-outline border-blue-900 hover:bg-blue-900 rounded-md border-2" on:click={click}>{label}</button>
