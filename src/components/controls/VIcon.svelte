<script lang="ts">
    import { Icon, ExclamationCircle, CheckCircle } from "svelte-hero-icons";

    export let touched: any
    export let errors: any
</script>

{#if touched}
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-10">
        {#if errors === null}
            <Icon src={CheckCircle} solid class="w-5 h-5 text-green-500" />
        {:else}
            <Icon src={ExclamationCircle} solid class="w-5 h-5 text-red-500" />
        {/if}
    </div>
{/if} 