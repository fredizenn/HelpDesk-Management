<script lang="ts">
    export let click: any
    export let label: any = 'Cancel'

</script>

<button class="btn btn-outline btn-error rounded-md border-2" on:click={click}>{label}</button>
