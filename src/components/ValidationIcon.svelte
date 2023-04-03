<script lang="ts">
    import type { Field } from "svelte-form-helper";
    import { Icon, ExclamationCircle, CheckCircle } from "svelte-hero-icons";
    export let field: Field
    
</script>

{#if $field.touched}
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        {#if $field.valid}
            <Icon src={CheckCircle} solid class="w-5 h-5 text-green-500" />
        {:else}
            <Icon src={ExclamationCircle} solid class="w-5 h-5 text-red-500" />
        {/if}
    </div>
{/if}