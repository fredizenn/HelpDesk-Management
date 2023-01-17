<script lang="ts">
    import { Icon, ArrowSmLeft} from "svelte-hero-icons"

    export let click: any
</script>

<div class="tooltip tooltip-bottom" data-tip="Back">
    <button class="btn btn-circle btn-sm btn-outline border-2" on:click={click}>
        <Icon src={ArrowSmLeft} class="h-5 w-5" />
    </button>
</div>