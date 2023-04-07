<script lang="ts">
    export let click: any = ""
    export let styling: any = ""
    export let disable: any = true
    // export let label: any

</script>

<button class="btn btn-success rounded-md border-2 {styling}" disabled={disable} type="submit" on:click={click}>Save</button>
