<script lang="ts" context="module">
    import type { FieldState } from "svelte-form-helper";

    export const key = {}
    export type Context = {
        state: Readable<FieldState>
        style: string
    }
</script>

<script lang="ts">
	import type { Readable } from "svelte/store";
    import { setContext } from "svelte";

    export { state as for}

    let state: Readable<FieldState>
    let style = $$props.class

    setContext<Context>(key, { state, style})
</script>

{#if $state.show}
    <slot><div id={$state.id} class={style}>{$state.message}</div></slot>
{/if}
