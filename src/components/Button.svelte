<script lang="ts">
    export let click: any
    export let label: any

</script>

<button class="btn btn-outline btn-info rounded-md border-2" on:click={click}>{label}</button>
