<script lang="ts">
    import LoginComponent from "../../components/LoginComponent.svelte";
    import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    import { loggedIn, token } from "../../store";
	import toast, { Toaster } from 'svelte-french-toast';



    
    // onMount(async () => {        
    //     let tok = localStorage.getItem('token');

    //     if (tok !== null || tok !== '') {
    //         await goto('/dashboard')
    //     }
    //     else {
    //         goto('/login')
    //     }

    // })

    onMount(async () => {
        goto('dashboard')
    })

  
</script>
<Toaster />

