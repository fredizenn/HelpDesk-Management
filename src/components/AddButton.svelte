<script lang="ts">
    import { Icon, Plus} from "svelte-hero-icons"

    export let click: any
    export let dataTip: any = 'Add'
</script>

<div class="tooltip tooltip-bottom" data-tip={dataTip}>
    <button class="btn btn-circle btn-md btn-outline border-blue-900 hover:bg-blue-900 border-2" on:click={click}>
        <Icon src={Plus} class="h-7 w-7" />
    </button>
</div>