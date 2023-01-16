<script>
    import LoginComponent from "../components/LoginComponent.svelte";
    import { store } from "../hooks/auth";
    import { goto } from "$app/navigation";
	import { onMount } from "svelte";


    onMount(async () => {
        goto("/dashboard")
    })
</script>


<!-- {#if $store != null}  -->

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<!-- {:else} 
<LoginComponent />
{/if} -->
