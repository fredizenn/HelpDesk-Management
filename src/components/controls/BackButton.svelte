<script lang="ts">
    import { Icon, ArrowSmLeft} from "svelte-hero-icons"

    export let click: any
</script>

<div class="tooltip tooltip-bottom" data-tip="Back">
    <button class="btn btn-circle btn-md btn-outline border-2" on:click={click}>
        <Icon src={ArrowSmLeft} class="h-7 w-7" />
    </button>
</div>